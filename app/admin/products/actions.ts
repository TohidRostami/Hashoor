"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminOrSubAdmin } from "@/lib/require-admin";
import { deleteFromArvan, keyFromUrl } from "@/lib/storage";
import { processAndUploadImage, type UploadOutcome } from "@/lib/image-upload";
import { syncProductInStock } from "@/lib/inventory";

// One "color block" from the admin form: a color's name + hex, the sizes
// available in that color (each with its own stock), and that color's
// own photos. The whole product's variant/image structure is just an
// array of these.
export type ColorGroupInput = {
  name: string;
  hexValue: string | null;
  images: string[];
  sizes: { sizeId: string; stock: number }[];
};

export type ProductFormInput = {
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  colorGroups: ColorGroupInput[];
};

function validate(input: ProductFormInput): string | null {
  if (!input.name.trim()) return "نام محصول را وارد کنید.";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.slug))
    return "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط‌تیره باشد.";
  if (!input.categoryId) return "دسته‌بندی را انتخاب کنید.";
  if (!input.price || input.price <= 0) return "قیمت باید بزرگ‌تر از صفر باشد.";
  if (!input.description.trim()) return "توضیحات محصول را وارد کنید.";

  for (const group of input.colorGroups) {
    if (!group.name.trim()) return "برای هر مدل، نام رنگ را وارد کنید.";
    if (group.sizes.length === 0)
      return `برای رنگ «${group.name}» حداقل یک سایز اضافه کنید.`;
  }
  const names = input.colorGroups.map((g) => g.name.trim());
  if (new Set(names).size !== names.length)
    return "نام رنگ‌ها در یک محصول نباید تکراری باشد.";

  return null;
}

/** Replaces all of a product's colors/variants/images with the submitted
 * color groups — used by both create and update so the two never drift
 * apart. Deletes children before parents so nothing is orphaned. */
async function syncColorGroups(
  productId: string,
  colorGroups: ColorGroupInput[],
) {
  const existingImages = (await prisma.productImage.findMany({
    where: { productId },
  })) as { url: string }[];
  const keptUrls = new Set(colorGroups.flatMap((g) => g.images));
  for (const img of existingImages) {
    if (!keptUrls.has(img.url)) {
      const key = keyFromUrl(img.url);
      if (key) await deleteFromArvan(key).catch(() => {});
    }
  }

  await prisma.productVariant.deleteMany({ where: { productId } });
  await prisma.productImage.deleteMany({ where: { productId } });
  await prisma.color.deleteMany({ where: { productId } });

  for (const [i, group] of colorGroups.entries()) {
    const color = (await prisma.color.create({
      data: {
        productId,
        name: group.name.trim(),
        hexValue: group.hexValue,
        sortOrder: i,
      },
    })) as { id: string };

    for (const { sizeId, stock } of group.sizes) {
      await prisma.productVariant.create({
        data: { productId, colorId: color.id, sizeId, stock },
      });
    }

    for (const [j, url] of group.images.entries()) {
      await prisma.productImage.create({
        data: { productId, colorId: color.id, url, sortOrder: j },
      });
    }
  }
}

export async function createProduct(input: ProductFormInput) {
  await requireAdminOrSubAdmin();
  const error = validate(input);
  if (error) return { error };

  const product = (await prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      categoryId: input.categoryId,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      description: input.description,
      isPublished: input.isPublished,
      isFeatured: input.isFeatured,
      isNew: input.isNew,
    },
  })) as { id: string };

  await syncColorGroups(product.id, input.colorGroups);
  await syncProductInStock(prisma, product.id);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true as const, id: product.id };
}

export async function updateProduct(id: string, input: ProductFormInput) {
  await requireAdminOrSubAdmin();
  const error = validate(input);
  if (error) return { error };

  await prisma.product.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      categoryId: input.categoryId,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      description: input.description,
      isPublished: input.isPublished,
      isFeatured: input.isFeatured,
      isNew: input.isNew,
    },
  });

  await syncColorGroups(id, input.colorGroups);
  await syncProductInStock(prisma, id);

  revalidatePath("/admin/products");
  revalidatePath(`/products/${input.slug}`);
  return { success: true as const };
}

export async function deleteProduct(id: string) {
  await requireAdminOrSubAdmin();

  const images = (await prisma.productImage.findMany({
    where: { productId: id },
  })) as { url: string }[];

  try {
    // Try a real delete first — only succeeds if nothing (like a past
    // order) references this product. Colors/variants/images cascade
    // with it.
    await prisma.product.delete({ where: { id } });
    for (const img of images) {
      const key = keyFromUrl(img.url);
      if (key) await deleteFromArvan(key).catch(() => {});
    }
  } catch {
    // Referenced by an existing order — archive instead of a hard delete
    // so order history stays intact. Also unpublish so it disappears
    // from the storefront immediately. Images are kept, since the
    // product record itself still exists.
    await prisma.product.update({
      where: { id },
      data: { isArchived: true, isPublished: false },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true as const };
}

export async function uploadProductImage(
  formData: FormData,
): Promise<UploadOutcome> {
  await requireAdminOrSubAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "فایلی انتخاب نشده است." };
  return processAndUploadImage(file, "products");
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { deleteFromArvan, keyFromUrl } from "@/lib/storage";
import { processAndUploadImage, type UploadOutcome } from "@/lib/image-upload";

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
  variants: { sizeId: string; stock: number }[];
  images: string[];
};

function validate(input: ProductFormInput): string | null {
  if (!input.name.trim()) return "نام محصول را وارد کنید.";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.slug)) return "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط‌تیره باشد.";
  if (!input.categoryId) return "دسته‌بندی را انتخاب کنید.";
  if (!input.price || input.price <= 0) return "قیمت باید بزرگ‌تر از صفر باشد.";
  if (!input.description.trim()) return "توضیحات محصول را وارد کنید.";
  return null;
}

export async function createProduct(input: ProductFormInput) {
  await requireAdmin();
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

  for (const v of input.variants) {
    if (v.sizeId) {
      await prisma.productVariant.create({
        data: { productId: product.id, sizeId: v.sizeId, stock: v.stock },
      });
    }
  }

  for (const [i, url] of input.images.entries()) {
    await prisma.productImage.create({ data: { productId: product.id, url, sortOrder: i } });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true as const, id: product.id };
}

export async function updateProduct(id: string, input: ProductFormInput) {
  await requireAdmin();
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

  await prisma.productVariant.deleteMany({ where: { productId: id } });
  for (const v of input.variants) {
    if (v.sizeId) {
      await prisma.productVariant.create({ data: { productId: id, sizeId: v.sizeId, stock: v.stock } });
    }
  }

  const existingImages = (await prisma.productImage.findMany({ where: { productId: id } })) as {
    id: string;
    url: string;
  }[];
  const keep = new Set(input.images);
  for (const img of existingImages) {
    if (!keep.has(img.url)) {
      const key = keyFromUrl(img.url);
      if (key) await deleteFromArvan(key).catch(() => {});
    }
  }
  await prisma.productImage.deleteMany({ where: { productId: id } });
  for (const [i, url] of input.images.entries()) {
    await prisma.productImage.create({ data: { productId: id, url, sortOrder: i } });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products/${input.slug}`);
  return { success: true as const };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const images = (await prisma.productImage.findMany({ where: { productId: id } })) as { url: string }[];
  for (const img of images) {
    const key = keyFromUrl(img.url);
    if (key) await deleteFromArvan(key).catch(() => {});
  }
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true as const };
}

export async function uploadProductImage(formData: FormData): Promise<UploadOutcome> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "فایلی انتخاب نشده است." };
  return processAndUploadImage(file, "products");
}

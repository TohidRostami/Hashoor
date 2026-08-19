"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CategoryDTO, ProductDetailDTO, SizeDTO } from "@/lib/types";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  type ProductFormInput,
} from "@/app/admin/products/actions";
import { createSize } from "@/app/admin/sizes/actions";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProductForm({
  categories,
  sizes: initialSizes,
  product,
}: {
  categories: CategoryDTO[];
  sizes: SizeDTO[];
  product?: ProductDetailDTO;
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [categoryId, setCategoryId] = useState(
    product?.category.id ?? categories[0]?.id ?? "",
  );
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice?.toString() ?? "",
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [isPublished, setIsPublished] = useState(product?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [images, setImages] = useState<string[]>(
    product?.images.map((i) => i.url) ?? [],
  );

  // Sizes are a store-wide list — extended in place here if the admin
  // creates a new one, so it's immediately usable without leaving the form.
  const [sizes, setSizes] = useState(initialSizes);
  const [variantStocks, setVariantStocks] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      product?.variants.forEach((v) => {
        if (v.sizeId) initial[v.sizeId] = v.stock;
      });
      return initial;
    },
  );

  const [newSizeOpen, setNewSizeOpen] = useState(false);
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizeDesc, setNewSizeDesc] = useState("");
  const [newSizeLoading, setNewSizeLoading] = useState(false);
  const [newSizeError, setNewSizeError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      const generated = slugify(value);
      setSlug(/[a-z0-9]/.test(generated) ? generated : "");
    }
  }

  function toggleSize(sizeId: string, checked: boolean) {
    setVariantStocks((prev) => {
      const next = { ...prev };
      if (checked) next[sizeId] = next[sizeId] ?? 0;
      else delete next[sizeId];
      return next;
    });
  }

  async function handleAddSize() {
    if (!newSizeName.trim()) return;
    setNewSizeLoading(true);
    setNewSizeError(null);

    const result = await createSize({
      name: newSizeName,
      description: newSizeDesc,
      sortOrder: sizes.length + 1,
    });

    setNewSizeLoading(false);
    if ("error" in result) {
      setNewSizeError(result.error);
      return;
    }

    setSizes((prev) => [...prev, result.size]);
    setVariantStocks((prev) => ({ ...prev, [result.size.id]: 0 }));
    toast.success(
      `سایز «${result.size.name}» ساخته شد — از این به بعد برای همه محصولات در دسترس است`,
    );
    setNewSizeName("");
    setNewSizeDesc("");
    setNewSizeOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: ProductFormInput = {
      name,
      slug,
      categoryId,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      description,
      isPublished,
      isFeatured,
      isNew,
      variants: Object.entries(variantStocks).map(([sizeId, stock]) => ({
        sizeId,
        stock,
      })),
      images,
    };

    const result = isEdit
      ? await updateProduct(product.id, input)
      : await createProduct(input);
    setLoading(false);

    if ("error" in result) {
      setError(result.error ?? "خطایی رخ داد.");
      return;
    }
    toast.success(isEdit ? "محصول به‌روزرسانی شد" : "محصول ساخته شد");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 rounded-lg border border-border p-6 lg:col-span-2">
          <h2 className="text-sm font-medium">اطلاعات پایه</h2>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">نام محصول</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">اسلاگ (برای آدرس صفحه)</Label>
            <Input
              id="slug"
              required
              dir="ltr"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              فقط حروف انگلیسی کوچک، عدد و خط‌تیره — مثل{" "}
              <span dir="ltr">pirahan-abi</span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">دسته‌بندی</Label>
            <select
              id="category"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">قیمت (تومان)</Label>
              <Input
                id="price"
                type="number"
                dir="ltr"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-end appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="compareAtPrice">
                قیمت قبل از تخفیف (اختیاری)
              </Label>
              <Input
                id="compareAtPrice"
                type="number"
                dir="ltr"
                min={0}
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className="text-end appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">توضیحات</Label>
            <textarea
              id="description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>تصاویر محصول</Label>
            <MultiImageUploader
              images={images}
              onChange={setImages}
              uploadAction={uploadProductImage}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
            <h2 className="text-sm font-medium">وضعیت</h2>
            <ToggleRow
              label="منتشرشده"
              description="در فروشگاه نمایش داده شود"
              checked={isPublished}
              onChange={setIsPublished}
            />
            <ToggleRow
              label="محصول ویژه"
              description="در صفحه اصلی نمایش داده شود"
              checked={isFeatured}
              onChange={setIsFeatured}
            />
            <ToggleRow
              label="جدید"
              description="نشان «جدید» روی محصول"
              checked={isNew}
              onChange={setIsNew}
            />
          </div>

          <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
            <div>
              <h2 className="text-sm font-medium">سایز و موجودی</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                سایزهایی که این محصول در آن‌ها موجود است را تیک بزنید و موجودی
                هرکدام را وارد کنید.
              </p>
            </div>

            {sizes.length === 0 && (
              <p className="text-xs text-muted-foreground">
                هنوز سایزی ساخته نشده — اولین سایز را پایین بسازید.
              </p>
            )}

            <div className="flex flex-col gap-2.5">
              {sizes.map((s) => {
                const checked = s.id in variantStocks;
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <label className="flex min-w-0 items-center gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggleSize(s.id, e.target.checked)}
                        className="size-4 shrink-0 rounded-sm border-input accent-foreground"
                      />

                      <span className="shrink-0 font-nums font-medium">
                        {s.name}
                      </span>

                      {s.description && (
                        <span className="min-w-0 truncate text-xs text-muted-foreground">
                          {s.description}
                        </span>
                      )}
                    </label>
                    {checked && (
                      <Input
                        type="number"
                        dir="ltr"
                        min={0}
                        value={variantStocks[s.id]}
                        onChange={(e) =>
                          setVariantStocks((prev) => ({
                            ...prev,
                            [s.id]: Number(e.target.value),
                          }))
                        }
                        className="h-8 w-12 shrink-0 px-1 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {newSizeOpen ? (
              <div className="flex flex-col gap-3 rounded-md border border-dashed border-border p-4">
                <div className="flex flex-col gap-3">
                  <Input
                    autoFocus
                    placeholder="نام سایز — مثلاً M یا 42"
                    value={newSizeName}
                    onChange={(e) => setNewSizeName(e.target.value)}
                  />
                  <Input
                    placeholder="توضیح/ابعاد (اختیاری)"
                    value={newSizeDesc}
                    onChange={(e) => setNewSizeDesc(e.target.value)}
                  />
                </div>
                {newSizeError && (
                  <p className="text-xs text-destructive">{newSizeError}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSize}
                    disabled={newSizeLoading || !newSizeName.trim()}
                  >
                    {newSizeLoading ? "در حال ساخت..." : "افزودن سایز"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setNewSizeOpen(false)}
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setNewSizeOpen(true)}
                className="flex items-center gap-1.5 self-start text-sm text-accent-2 transition-colors hover:underline"
              >
                <Plus className="size-3.5" />
                افزودن سایز جدید
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={loading}>
          {loading
            ? "در حال ذخیره..."
            : isEdit
              ? "ذخیره تغییرات"
              : "ساخت محصول"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

import { prisma } from "@/lib/db";

export type OutOfStockVariantRow = {
  sizeName: string | null;
  colorName: string | null;
};

export type OutOfStockProductRow = {
  id: string;
  name: string;
  slug: string;
  // Mirrors Product.inStock — true only when *every* variant is at
  // zero, not just the ones listed below.
  isFullyOutOfStock: boolean;
  outOfStockVariants: OutOfStockVariantRow[];
};

export async function getOutOfStockProducts(): Promise<OutOfStockProductRow[]> {
  // Archived/draft products aren't live on the storefront, so "out of
  // stock on the site" doesn't apply to them — excluded here rather
  // than filtered out later, so the count itself is already correct.
  const zeroStockVariants = await prisma.productVariant.findMany({
    where: {
      stock: 0,
      product: { isPublished: true, isArchived: false },
    },
    include: {
      size: true,
      color: true,
      product: { select: { id: true, name: true, slug: true, inStock: true } },
    },
    orderBy: { product: { name: "asc" } },
  });

  const byProduct = new Map<string, OutOfStockProductRow>();
  for (const v of zeroStockVariants as unknown as {
    size: { name: string } | null;
    color: { name: string } | null;
    product: { id: string; name: string; slug: string; inStock: boolean };
  }[]) {
    const p = v.product;
    if (!byProduct.has(p.id)) {
      byProduct.set(p.id, {
        id: p.id,
        name: p.name,
        slug: p.slug,
        isFullyOutOfStock: !p.inStock,
        outOfStockVariants: [],
      });
    }
    byProduct.get(p.id)!.outOfStockVariants.push({
      sizeName: v.size?.name ?? null,
      colorName: v.color?.name ?? null,
    });
  }

  return Array.from(byProduct.values());
}

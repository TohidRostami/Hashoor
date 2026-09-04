import { prisma } from "@/lib/db";

/**
 * Recomputes and persists Product.inStock from its variants' current
 * stock levels. Call this after anything that can change stock:
 *   - saving the admin product form (app/admin/products/actions.ts)
 *   - reserving stock at checkout (app/(shop)/checkout/actions.ts)
 *   - releasing stock back after a failed payment (same file)
 *
 * Accepts either the main `prisma` client or a `tx` handle from inside
 * `prisma.$transaction(async (tx) => ...)`, so the flag update can be
 * part of the same atomic operation as the stock change that caused it.
 */
export async function syncProductInStock(
  client: typeof prisma,
  productId: string
): Promise<void> {
  const variants = (await client.productVariant.findMany({
    where: { productId },
    select: { stock: true },
  })) as { stock: number }[];

  // A product with no variants at all (a "simple" product) has nothing
  // to be out of stock of, by this app's convention.
  const inStock = variants.length === 0 || variants.some((v) => v.stock > 0);

  await client.product.update({
    where: { id: productId },
    data: { inStock },
  });
}

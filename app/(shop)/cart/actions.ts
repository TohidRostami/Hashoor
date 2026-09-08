"use server";

import { prisma } from "@/lib/db";
import {
  validateDiscountCode,
  type DiscountValidationResult,
} from "@/lib/discount";

export type CartValidationItem = { productId: string; variantId: string };

export type CartItemStatus = {
  variantId: string;
  /** false if the product no longer exists, is unpublished, archived,
   * or the specific variant itself was removed. */
  available: boolean;
  price: number;
  /** Current stock for this exact variant. A product with no variants
   * at all (see add-to-cart-form.tsx's placeholder-id convention) is
   * always treated as unlimited, matching checkout's own logic. */
  stock: number;
  name: string;
};

const UNLIMITED_STOCK = Number.MAX_SAFE_INTEGER;

export async function getCartItemsStatus(
  items: CartValidationItem[],
): Promise<CartItemStatus[]> {
  if (items.length === 0) return [];

  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = (await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: { select: { id: true, stock: true } } },
  })) as unknown as {
    id: string;
    name: string;
    price: number;
    isPublished: boolean;
    isArchived: boolean;
    variants: { id: string; stock: number }[];
  }[];

  const productById = new Map(products.map((p) => [p.id, p]));

  return items.map((item) => {
    const product = productById.get(item.productId);

    if (!product || !product.isPublished || product.isArchived) {
      return {
        variantId: item.variantId,
        available: false,
        price: 0,
        stock: 0,
        name: "",
      };
    }

    const hasRealVariants = product.variants.length > 0;
    if (!hasRealVariants) {
      // No-variant product — item.variantId is really just product.id
      // (see add-to-cart-form.tsx), so there's no specific variant row
      // to look up or run out of.
      return {
        variantId: item.variantId,
        available: true,
        price: product.price,
        stock: UNLIMITED_STOCK,
        name: product.name,
      };
    }

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      return {
        variantId: item.variantId,
        available: false,
        price: 0,
        stock: 0,
        name: product.name,
      };
    }

    return {
      variantId: item.variantId,
      available: true,
      price: product.price,
      stock: variant.stock,
      name: product.name,
    };
  });
}

/** Thin action wrapper — the actual rules live in lib/discount.ts so
 * checkout's authoritative re-check can never drift out of sync with
 * what the cart previews here. */
export async function applyDiscountCode(
  code: string,
  subtotal: number,
): Promise<DiscountValidationResult> {
  return validateDiscountCode(code, subtotal);
}

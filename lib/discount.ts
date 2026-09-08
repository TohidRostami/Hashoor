import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export type DiscountValidationResult =
  | {
      valid: true;
      id: string;
      code: string;
      type: "PERCENTAGE" | "FIXED";
      value: number;
      discountAmount: number;
    }
  | { valid: false; error: string };

/**
 * Validates a discount code against the current subtotal and computes
 * the resulting discount amount. Used both for the cart's "اعمال" button
 * (a preview) and — critically — re-run from scratch at actual checkout
 * time, since the cart's version is never trusted for the real charge.
 */
export async function validateDiscountCode(
  code: string,
  subtotal: number
): Promise<DiscountValidationResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, error: "کد تخفیف را وارد کنید." };

  const discount = (await prisma.discountCode.findUnique({ where: { code: normalized } })) as {
    id: string;
    code: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    maxUses: number | null;
    usedCount: number;
    minOrderTotal: number | null;
    expiresAt: Date | null;
    isActive: boolean;
  } | null;

  if (!discount) return { valid: false, error: "کد تخفیف معتبر نیست." };
  if (!discount.isActive) return { valid: false, error: "این کد تخفیف غیرفعال است." };
  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return { valid: false, error: "این کد تخفیف منقضی شده است." };
  }
  if (discount.maxUses != null && discount.usedCount >= discount.maxUses) {
    return { valid: false, error: "ظرفیت استفاده از این کد تخفیف تمام شده است." };
  }
  if (discount.minOrderTotal != null && subtotal < discount.minOrderTotal) {
    return {
      valid: false,
      error: `این کد تخفیف فقط برای سفارش‌های بالای ${formatPrice(discount.minOrderTotal)} تومان معتبر است.`,
    };
  }

  const discountAmount =
    discount.type === "PERCENTAGE"
      ? Math.round((subtotal * discount.value) / 100)
      : Math.min(discount.value, subtotal); // never discount more than the subtotal itself

  return {
    valid: true,
    id: discount.id,
    code: discount.code,
    type: discount.type,
    value: discount.value,
    discountAmount,
  };
}

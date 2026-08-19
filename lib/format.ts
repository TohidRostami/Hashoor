export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatToman(value: number): string {
  return `${formatPrice(value)} تومان`;
}

/** Normalizes an Iranian mobile number ("0912...", "912...") to E.164 ("+98912..."). */
export function normalizeIranPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("98")) return `+${digits}`;
  if (digits.startsWith("0")) return `+98${digits.slice(1)}`;
  return `+98${digits}`;
}

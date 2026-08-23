const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Converts any Latin digits (0-9) found in the input to Persian digits — everything else (commas, spaces, other characters) is left untouched. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(
    /[0-9]/g,
    (digit) => PERSIAN_DIGITS[Number(digit)],
  );
}

const LATIN_DIGITS: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
};

/** The reverse of toPersianDigits — used before parsing user-typed input, since a Persian keyboard often produces Persian digits. */
function toLatinDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (digit) => LATIN_DIGITS[digit]);
}

export function formatPrice(value: number): string {
  return toPersianDigits(new Intl.NumberFormat("en-US").format(value));
}

export function formatToman(value: number): string {
  return `${formatPrice(value)} تومان`;
}

/**
 * Normalizes an Iranian mobile number ("0912...", "912...", or one typed
 * with Persian digits) to E.164 ("+98912...").
 *
 * Deliberately NOT switched to Persian digits — this is a technical
 * identifier (sent to the SMS provider, matched against Better Auth's
 * phone plugin, stored in the database), not something displayed to a
 * person, so it must stay plain ASCII regardless of the display-
 * formatting change above.
 */
export function normalizeIranPhone(input: string): string {
  const digits = toLatinDigits(input).replace(/\D/g, "");
  if (digits.startsWith("98")) return `+${digits}`;
  if (digits.startsWith("0")) return `+98${digits.slice(1)}`;
  return `+98${digits}`;
}

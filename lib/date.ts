import { toJalaali } from "jalaali-js";

const MONTHS_FA = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** Formats a date as a Jalali (Shamsi) date — e.g. "۲۶ مرداد ۱۴۰۵" → "26 مرداد 1405". */
export function formatJalali(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { jy, jm, jd } = toJalaali(d);
  return `${jd} ${MONTHS_FA[jm - 1]} ${jy}`;
}

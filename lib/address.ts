import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().trim().min(3, "نام و نام خانوادگی را کامل وارد کنید."),
  phone: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)."),
  province: z.string().trim().min(2, "استان را وارد کنید."),
  city: z.string().trim().min(2, "شهر را وارد کنید."),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد."),
  addressLine: z.string().trim().min(10, "آدرس کامل را دقیق‌تر بنویسید."),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;

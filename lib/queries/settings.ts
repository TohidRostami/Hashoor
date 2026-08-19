import { prisma } from "@/lib/db";

export type SiteSettings = {
  emailLoginEnabled: boolean;
  smsLoginEnabled: boolean;
  freeShippingThreshold: number | null;
  standardShippingCost: number;
};

const DEFAULTS: SiteSettings = {
  emailLoginEnabled: true,
  smsLoginEnabled: true,
  freeShippingThreshold: null,
  standardShippingCost: 0,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
  if (!settings) return DEFAULTS;
  return settings as unknown as SiteSettings;
}

import { prisma } from "@/lib/db";

export type HeroImageDTO = { id: string; url: string; sortOrder: number };

export async function getHeroImages(): Promise<HeroImageDTO[]> {
  const images = (await prisma.heroImage.findMany({})) as unknown as HeroImageDTO[];
  return images.sort((a, b) => a.sortOrder - b.sortOrder);
}

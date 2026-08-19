import { HeroContent } from "@/components/home/hero-content";
import { getHeroImages } from "@/lib/queries/hero-images";

export async function Hero() {
  const heroImages = await getHeroImages();
  return <HeroContent heroImages={heroImages.map((i) => i.url)} />;
}

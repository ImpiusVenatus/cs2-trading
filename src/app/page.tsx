import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedItems } from "@/components/sections/featured-items";
import { FeaturesSection } from "@/components/sections/features-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedItems />
      <FeaturesSection />
    </div>
  );
}

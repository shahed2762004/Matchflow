import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Integrations } from "@/components/marketing/integrations";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Integrations />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}

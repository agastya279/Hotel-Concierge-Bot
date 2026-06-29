import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

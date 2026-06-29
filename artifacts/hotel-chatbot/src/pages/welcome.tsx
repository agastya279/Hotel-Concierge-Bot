import { Navbar } from "@/components/landing/navbar";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { Hero } from "@/components/landing/hero";
import { MarqueeBanner } from "@/components/landing/marquee";
import { StatsSection } from "@/components/landing/stats-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RoomShowcase } from "@/components/landing/room-showcase";
import { ParallaxDivider } from "@/components/landing/parallax-divider";
import { ChatPreview } from "@/components/landing/chat-preview";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTABanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";
import { FloatingChat } from "@/components/landing/floating-chat";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <MarqueeBanner />
      <StatsSection />
      <HowItWorks />
      <RoomShowcase />
      <ParallaxDivider />
      <ChatPreview />
      <FeatureGrid />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
      <FloatingChat />
    </div>
  );
}

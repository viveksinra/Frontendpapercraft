import { FAQ } from 'src/components/landing/faq';
import { Hero } from 'src/components/landing/hero';
import { Footer } from 'src/components/landing/footer';
import { Pricing } from 'src/components/landing/pricing';
import { FinalCTA } from 'src/components/landing/final-cta';
import { LandingHeader } from 'src/components/landing/header';
import { HowItWorks } from 'src/components/landing/how-it-works';
import { Testimonials } from 'src/components/landing/testimonials';
import { FeaturesGrid } from 'src/components/landing/features-grid';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <LandingHeader />
      <main>
        <Hero />
        <FeaturesGrid />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

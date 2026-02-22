import { LandingHeader } from 'src/components/landing/header';
import { Hero } from 'src/components/landing/hero';
import { FeaturesGrid } from 'src/components/landing/features-grid';
import { HowItWorks } from 'src/components/landing/how-it-works';
import { Testimonials } from 'src/components/landing/testimonials';
import { Pricing } from 'src/components/landing/pricing';
import { FAQ } from 'src/components/landing/faq';
import { FinalCTA } from 'src/components/landing/final-cta';
import { Footer } from 'src/components/landing/footer';

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

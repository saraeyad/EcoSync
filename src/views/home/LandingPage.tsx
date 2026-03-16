import { motion } from "framer-motion";
import { Navbar } from "./components/Navbar.tsx";
import { Hero } from "./components/Hero.tsx";
import { Features } from "./components/Features.tsx";
import { HowItWorksSection } from "./components/HowItWorksSection.tsx";
import { Stats } from "./components/Stats.tsx";
import { TestimonialsSection } from "./components/TestimonialsSection.tsx";
import { PricingSection } from "./components/PricingSection.tsx";
import { EnergyTimeline } from "./components/EnergyTimeline.tsx";
import { GlobalParticleField } from "./components/GlobalParticleField.tsx";
import { Footer } from "./components/Footer.tsx";

export function LandingPage() {
  return (
    <>
      {/* Fixed background + navbar — outside motion.div to avoid stacking-context trap */}
      <GlobalParticleField />
      <Navbar />

      {/* Page body — fades in/out on route transition */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        exit={{    opacity: 0, y: -8  }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen bg-background overflow-x-hidden"
      >
        <div className="relative">
          {/* Scroll-driven energy spine */}
          <EnergyTimeline />

          {/* 1 ─ Hook + first impression */}
          <Hero />

          {/* 2 ─ Educate on capabilities */}
          <div id="features">
            <Features />
          </div>

          {/* 3 ─ Remove friction / clarity */}
          <HowItWorksSection />

          {/* 4 ─ Build credibility */}
          <div id="stats">
            <Stats />
          </div>

          {/* 5 ─ Social proof before pricing */}
          <TestimonialsSection />

          {/* 6 ─ Convert + CTA merged in */}
          <PricingSection />

          {/* Footer */}
          <Footer />
        </div>
      </motion.div>
    </>
  );
}

import { useRef, type FC, Suspense, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, BarChart3, Globe2, Cpu, ShieldCheck, Zap, Leaf, type LucideIcon } from "lucide-react";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";
import { MiniBarChart, MiniGlobe, MiniOrbit } from "./BentoMiniCanvas.tsx";

interface Feature {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  size: "large" | "small";
  accent: string;
  badge: string;
  miniCanvas?: "bars" | "globe" | "orbit";
}

const features: Feature[] = [
  {
    id: 1, icon: Activity, title: "Real-Time Sensor Grid", size: "large", accent: "#10b981", badge: "Live Data", miniCanvas: "bars",
    description: "Sub-second telemetry from 50,000+ IoT endpoints. Carbon, energy, and thermal data unified into one stream.",
  },
  {
    id: 2, icon: Globe2, title: "Global Facility Map", size: "small", accent: "#34d399", badge: "450+ Sites", miniCanvas: "globe",
    description: "Visualize your entire network on an interactive globe with real-time status overlays.",
  },
  {
    id: 3, icon: BarChart3, title: "Carbon Analytics", size: "small", accent: "#6ee7b7", badge: "AI-Powered",
    description: "ML-powered carbon forecasting with scenario modeling to hit net-zero targets by 2030.",
  },
  {
    id: 4, icon: Cpu, title: "Edge Intelligence", size: "small", accent: "#10b981", badge: "<50ms", miniCanvas: "orbit",
    description: "On-device ML models process anomalies locally, reducing cloud latency to <50ms.",
  },
  {
    id: 5, icon: ShieldCheck, title: "Compliance Automation", size: "large", accent: "#34d399", badge: "ISO 14001",
    description: "Auto-generate ISO 14001, GHG Protocol, and CDP reports. One-click submissions across 60+ jurisdictions.",
  },
  {
    id: 6, icon: Zap, title: "Energy Optimization", size: "small", accent: "#a7f3d0", badge: "-35% Cost",
    description: "AI schedules energy-intensive processes during off-peak windows, cutting costs by up to 35%.",
  },
];

function ComplianceVisual() {
  const tags = ["ISO 14001", "GHG Protocol", "CDP", "TCFD", "SASB"];
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((s, i) => (
        <motion.span key={s}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.12 + 0.4 }}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        >{s}</motion.span>
      ))}
    </div>
  );
}

const FeatureCard: FC<{ feature: Feature; index: number }> = memo(({ feature, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });
  const { icon: Icon, title, description, size, accent, badge, miniCanvas } = feature;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.9, filter: "blur(10px)" }}
      animate={isInView
        ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, y: 48, scale: 0.9, filter: "blur(10px)" }
      }
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`bento-card group cursor-default flex flex-col ${size === "large" ? "col-span-2" : "col-span-1"}`}
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
          <Icon size={20} style={{ color: accent }} />
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}28` }}>
          {badge}
        </span>
      </div>

      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-emerald-300 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{description}</p>

      {/* Compliance tags */}
      {feature.id === 5 && <ComplianceVisual />}

      {/* Mini 3D canvas */}
      {miniCanvas && (
        <div className="h-28 mt-4 -mx-2 rounded-xl overflow-hidden">
          <Suspense fallback={<div className="h-full bg-slate-800/40 animate-pulse rounded-xl" />}>
            {miniCanvas === "bars"  && <MiniBarChart color={accent} />}
            {miniCanvas === "globe" && <MiniGlobe    color={accent} />}
            {miniCanvas === "orbit" && <MiniOrbit    color={accent} />}
          </Suspense>
        </div>
      )}
    </motion.div>
  );
});


export function Features() {
  return (
    <section id="features" className="relative py-28 bg-background">
      <div className="absolute inset-0 bg-gradient-radial from-emerald-950/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 lg:pl-28">
        {/* Section header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <Leaf size={14} /> Platform Capabilities
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Everything you need to<br />
              <span className="text-gradient">decarbonize at scale.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              From raw sensor data to boardroom reports — the full stack of industrial sustainability intelligence.
            </p>
          </ScrollReveal>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {features.map((f, i) => <FeatureCard key={f.id} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}

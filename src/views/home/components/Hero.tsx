import { useRef, useCallback, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useMotionValueEvent } from "framer-motion";
import { ChevronDown, Zap, Globe, Shield } from "lucide-react";
import { HeroScene } from "./HeroScene.tsx";
import { PortalButton } from "../../../components/ui/PortalTransition.tsx";

const pills = [
  { icon: Zap,    label: "Real-time Monitoring" },
  { icon: Globe,  label: "Global Coverage"       },
  { icon: Shield, label: "ISO 14001 Compliant"   },
] as const;

export function Hero() {
  // Spring-physics mouse parallax
  const rawX   = useMotionValue(0);
  const rawY   = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 40, damping: 18, mass: 1 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 18, mass: 1 });

  // Bridge spring values into a plain ref for R3F (Three.js can't read MotionValues)
  const mousePos = useRef({ x: 0, y: 0 });
  useMotionValueEvent(springX, "change", (v) => { mousePos.current.x = v; });
  useMotionValueEvent(springY, "change", (v) => { mousePos.current.y = v; });

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2);
    rawY.set(-((e.clientY - rect.top)  / rect.height - 0.5) * 2);
  }, [rawX, rawY]);

  const scrollToFeatures = () =>
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Radial gradient backdrop */}
      <div className="absolute inset-0 bg-hero-pattern pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen py-24">

          {/* ── Left: Text ─────────────────────────────────── */}
          <div className="flex flex-col gap-7">

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-fit"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Platform · 450+ Facilities Online
              </span>
            </motion.div>

            {/* Headline with shimmer */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl lg:text-[72px] font-black leading-[1.03] tracking-tight">
                <span className="text-white block">Sustainability</span>
                <span className="text-shimmer block">at Scale.</span>
                <span className="text-slate-300 text-4xl lg:text-[46px] font-bold block leading-snug mt-2">
                  Monitor your global footprint<br className="hidden lg:block" /> in real-time.
                </span>
              </h1>
            </motion.div>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              className="text-slate-400 text-lg leading-relaxed max-w-lg"
            >
              EcoSync unifies industrial IoT sensors, carbon tracking, and AI-driven
              efficiency insights across your entire manufacturing network.
            </motion.p>

            {/* Pill tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap gap-2.5"
            >
              {pills.map(({ icon: Icon, label }, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface border border-slate-700/60 text-slate-300 text-sm font-medium"
                >
                  <Icon size={13} className="text-emerald-400" />
                  {label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <PortalButton label="Launch Dashboard →" to="/dashboard" className="text-base" />

              <motion.button
                className="inline-flex items-center gap-2 px-8 py-5 rounded-2xl glass border border-slate-600/50 text-slate-300 hover:text-white hover:border-emerald-500/40 font-semibold text-base transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToFeatures}
              >
                Explore Features
              </motion.button>
            </motion.div>

            {/* Scroll hint */}
            <motion.button
              onClick={scrollToFeatures}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-400 transition-colors text-xs tracking-widest uppercase mt-2 w-fit"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={14} />
              Scroll to explore
            </motion.button>
          </div>

          {/* ── Right: 3D Canvas with spring parallax ──────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[520px] lg:h-[700px]"
            style={{
              // Subtle CSS parallax from the spring
              rotateY: springX,
              rotateX: springY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Multi-layer glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-emerald-500/8  blur-[100px]" />
              <div className="w-64 h-64 rounded-full bg-teal-400/6    blur-[60px] absolute" />
            </div>

            {/* Floating stat chips */}
            {[
              { label: "1.2M Tons CO₂ Saved", offset: "-top-4 -left-4 lg:left-6",       delay: 1.3 },
              { label: "99.8% Uptime",        offset: "-bottom-2 right-2 lg:right-8",   delay: 1.5 },
              { label: "< 50ms Latency",      offset: "top-1/3 -right-4 lg:-right-2",   delay: 1.7 },
            ].map(({ label, offset, delay }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay }}
                className={`absolute ${offset} z-10 px-3 py-1.5 rounded-xl glass-strong border border-emerald-500/20 text-xs font-semibold text-emerald-300 whitespace-nowrap shadow-xl`}
              >
                {label}
              </motion.div>
            ))}

            <HeroScene mousePos={mousePos} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

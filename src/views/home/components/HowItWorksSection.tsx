import { motion } from "framer-motion";
import { Wifi, BarChart3, TrendingDown, ArrowRight } from "lucide-react";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";

const steps = [
  {
    number: "01",
    icon:   Wifi,
    title:  "Connect Your Facilities",
    desc:   "Plug in via Modbus, OPC-UA, MQTT, or our REST API. No special hardware required — if your sensor talks, EcoSync listens. Setup takes under 15 minutes per site.",
    tag:    "15 min setup",
    color:  "#10b981",
  },
  {
    number: "02",
    icon:   BarChart3,
    title:  "Monitor in Real-Time",
    desc:   "Live energy, carbon, and efficiency streams flow into your Command Center. AI flags anomalies before they become incidents. Every data point, every second.",
    tag:    "< 200ms latency",
    color:  "#34d399",
  },
  {
    number: "03",
    icon:   TrendingDown,
    title:  "Optimize & Report",
    desc:   "One-click ISO 14001 compliance reports, net-zero roadmaps, and AI-driven energy scheduling. Turn raw data into boardroom-ready sustainability strategy.",
    tag:    "1-click reports",
    color:  "#6ee7b7",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#10b981 1px,transparent 1px),linear-gradient(90deg,#10b981 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-5">
              How It Works
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Up and running in
              <br />
              <span className="text-gradient">three simple steps.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              No consultants, no complex IT projects. Connect, monitor, and act — in the same afternoon.
            </p>
          </ScrollReveal>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 relative">

          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-12 left-[calc(33.3%+2rem)] right-[calc(33.3%+2rem)] h-px"
            style={{ background: "linear-gradient(to right, #10b981, #34d399, #6ee7b7)" }} />

          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative flex flex-col p-7 rounded-3xl glass border border-slate-800/60 hover:border-emerald-500/20 transition-all duration-300 h-full"
              >
                {/* Glow blob */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: step.color }} />

                {/* Number + icon row */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <span className="text-5xl font-black leading-none"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}, transparent)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                    <step.icon size={22} style={{ color: step.color }} />
                  </div>
                </div>

                <h3 className="text-white font-black text-xl mb-3 relative z-10">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1 relative z-10">{step.desc}</p>

                {/* Tag */}
                <div className="mt-5 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: `${step.color}12`, color: step.color, border: `1px solid ${step.color}25` }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: step.color }} />
                    {step.tag}
                  </span>
                </div>

                {/* Arrow connector (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-6 top-12 z-20 w-12 items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <ArrowRight size={14} className="text-emerald-400" />
                    </div>
                  </div>
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

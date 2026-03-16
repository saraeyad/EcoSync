import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";

const testimonials = [
  {
    quote:   "EcoSync cut our sustainability reporting time by 80%. What used to take our team three weeks now takes one afternoon. The ISO 14001 audit passed without a single consultant.",
    name:    "Sarah Müller",
    role:    "Head of ESG",
    company: "Siemens Industrial",
    avatar:  "SM",
    gradient: "from-emerald-400 to-teal-600",
    stars:   5,
  },
  {
    quote:   "The Digital Twin alone saved us $2.1M in avoided downtime last year. Seeing a live 3D replica of our plant flag a thermal anomaly before it became a shutdown — that's the future.",
    name:    "James Okafor",
    role:    "Plant Operations Director",
    company: "TotalEnergies",
    avatar:  "JO",
    gradient: "from-blue-400 to-cyan-500",
    stars:   5,
    featured: true,
  },
  {
    quote:   "We connected 12 facilities across 4 countries in a single day. The Modbus integration was plug-and-play. Our board now gets live CO₂ dashboards instead of quarterly PDFs.",
    name:    "Priya Venkatesh",
    role:    "CTO",
    company: "ArcorSteel",
    avatar:  "PV",
    gradient: "from-violet-400 to-purple-600",
    stars:   5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/4 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-500/4 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-5">
              <Star size={11} fill="currentColor" /> Trusted by industry leaders
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Don't take our word for it.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Teams across manufacturing, energy, and heavy industry are hitting
              their sustainability targets faster with EcoSync.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`relative flex flex-col p-7 rounded-3xl h-full transition-all duration-300 ${
                  t.featured
                    ? "border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-slate-900/60"
                    : "glass border border-slate-800/60 hover:border-slate-700/60"
                }`}
                style={t.featured ? {
                  boxShadow: "0 0 60px rgba(16,185,129,0.1), inset 0 0 40px rgba(16,185,129,0.03)",
                } : undefined}
              >
                {/* Quote icon */}
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 shrink-0">
                  <Quote size={14} className="text-emerald-400" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={12} className="text-emerald-400 fill-emerald-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-slate-800/60">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-black text-slate-900 shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.company}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Social proof bar */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              "450+ facilities worldwide",
              "62 countries",
              "4.9 / 5 avg. rating",
              "ISO 27001 certified",
              "99.99% uptime",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

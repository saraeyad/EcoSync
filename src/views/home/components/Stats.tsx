import { useRef, useEffect, useState, type FC } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingDown, Factory, Globe, Award, type LucideIcon } from "lucide-react";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";

function useCounter(target: number, duration = 2000, start = false): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

interface StatCardProps {
  value: string;
  suffix?: string;
  label: string;
  icon: LucideIcon;
  color: string;
  index: number;
  started: boolean;
}

const StatCard: FC<StatCardProps> = ({ value, suffix, label, icon: Icon, color, index, started }) => {
  const numericValue = parseInt(value.replace(/\D/g, ""), 10);
  const count = useCounter(numericValue, 2200, started);

  const formatCount = (n: number): string => {
    if (numericValue >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (numericValue >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl p-8 relative overflow-hidden group"
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500" style={{ background: color }} />
      <div className="inline-flex p-3 rounded-xl mb-6" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div className="text-5xl font-black text-white mb-2 tabular-nums overflow-hidden">
        {formatCount(count)}
        {suffix && <span style={{ color }} className="text-3xl">{suffix}</span>}
      </div>
      <p className="text-slate-400 font-medium">{label}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30 group-hover:opacity-70 transition-opacity duration-300" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
    </motion.div>
  );
};

const stats: Omit<StatCardProps, "index" | "started">[] = [
  { value: "1200000", suffix: "+ Tons", label: "CO₂ Saved Globally",       icon: TrendingDown, color: "#10b981" },
  { value: "450",     suffix: "+",      label: "Facilities Connected",      icon: Factory,      color: "#34d399" },
  { value: "99",      suffix: ".99%",   label: "Platform Uptime SLA",       icon: Globe,        color: "#6ee7b7" },
  { value: "62",      suffix: "",       label: "Countries Monitored",       icon: Award,        color: "#a7f3d0" },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #10b981 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-5">
              Proven Impact
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Numbers that <span className="text-gradient">matter.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Real impact, measured in real-time across our global network of industrial facilities.
            </p>
          </ScrollReveal>
        </div>
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} started={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

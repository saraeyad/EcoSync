import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { FlipNumber } from "../../../components/ui/FlipNumber.tsx";

interface MetricCardProps {
  title:  string;
  value:  string;
  unit:   string;
  change: number;
  icon:   LucideIcon;
  color?: string;
  index?: number;
}

export const MetricCard = memo(function MetricCard({
  title, value, unit, change, icon: Icon, color = "#10b981", index = 0,
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="bento-card group relative"
    >
      {/* Top accent when hovered */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isPositive ? "+" : ""}{change}%
        </div>
      </div>

      {/* Flip-animated value */}
      <div className="text-3xl font-black text-white mb-1 flex items-end gap-1 overflow-hidden">
        <FlipNumber value={value} />
        <span className="text-base font-semibold text-slate-400 mb-0.5">{unit}</span>
      </div>
      <p className="text-slate-500 text-xs font-medium">{title}</p>

      {/* Hover radial glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}0a, transparent 65%)` }}
      />
    </motion.div>
  );
});

import { useState, memo } from "react";
import { motion } from "framer-motion";
import {
  Factory,
  MapPin,
  Zap,
  TrendingDown,
  Clock,
  ExternalLink,
} from "lucide-react";
import type {
  Factory as FactoryType,
  FactoryStatus,
} from "../../../types/index.ts";
import { useAppStore } from "../../../hooks/useStore.ts";
import { STATUS_COLORS } from "../../../config/theme.ts";

const statusColor: Record<FactoryStatus, string> = STATUS_COLORS;

interface Props {
  factory: FactoryType;
  index: number;
}

export const FactoryFlipCard = memo(function FactoryFlipCard({
  factory,
  index,
}: Props) {
  const [flipped, setFlipped] = useState(false);
  const { selectedFactory, setSelectedFactory } = useAppStore();
  const color = statusColor[factory.status];
  const isSelected = selectedFactory?.id === factory.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flip-card h-[120px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setSelectedFactory(isSelected ? null : factory)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="flip-card-inner w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT ─────────────────────────── */}
        <div
          className="flip-card-front absolute inset-0 glass rounded-xl p-4 flex items-center gap-3"
          style={{
            backfaceVisibility: "hidden",
            border: isSelected
              ? `1px solid ${color}50`
              : "1px solid rgba(30,41,59,0.8)",
            boxShadow: isSelected ? `0 0 20px ${color}20` : "none",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
          >
            <Factory size={18} style={{ color }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-sm truncate">
              {factory.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-slate-500" />
              <p className="text-slate-500 text-xs truncate">
                {factory.location}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: color, boxShadow: `0 0 4px ${color}` }}
              />
              <span
                className="text-xs font-semibold capitalize"
                style={{ color }}
              >
                {factory.status}
              </span>
            </div>
            <p className="text-lg font-black text-white">
              {factory.efficiency > 0 ? `${factory.efficiency}%` : "—"}
            </p>
            <p className="text-xs text-slate-500">efficiency</p>
          </div>
        </div>

        {/* ── BACK ──────────────────────────── */}
        <div
          className="flip-card-back absolute inset-0 rounded-xl p-4 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, ${color}12, rgba(15,23,42,0.95))`,
            border: `1px solid ${color}35`,
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-white font-bold text-sm">{factory.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFactory(factory);
              }}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={12} style={{ color }} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Zap, val: factory.output, label: "Output" },
              {
                icon: TrendingDown,
                val: `${factory.co2Saved.toLocaleString()}t`,
                label: "CO₂ Saved",
              },
              { icon: Clock, val: `${factory.uptime}%`, label: "Uptime" },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="text-center">
                <Icon size={11} style={{ color }} className="mx-auto mb-0.5" />
                <p className="text-white font-bold text-xs">{val}</p>
                <p className="text-slate-500 text-[9px]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

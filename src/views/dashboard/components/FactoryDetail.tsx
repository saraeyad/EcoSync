import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Factory,
  MapPin,
  Thermometer,
  Zap,
  TrendingDown,
  Clock,
  Award,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { useAppStore } from "../../../hooks/useStore.ts";
import type { Factory as FactoryType } from "../../../types/index.ts";
import { exportEnergyJSON } from "../../../lib/exportUtils.ts";

function StatRow({
  icon: Icon,
  label,
  value,
  color = "#94a3b8",
}: {
  icon: typeof Factory;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800/40 last:border-0">
      <div className="flex items-center gap-2.5">
        <Icon size={14} style={{ color }} className="shrink-0" />
        <span className="text-slate-400 text-xs">{label}</span>
      </div>
      <span className="text-sm font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function EfficiencyRing({ value, color }: { value: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#1e293b"
          strokeWidth="5"
        />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-base font-black" style={{ color }}>
          {value}%
        </span>
      </div>
    </div>
  );
}

interface FactoryDetailProps {
  factory: FactoryType;
  onClose: () => void;
}

const statusColor: Record<string, string> = {
  online: "#10b981",
  warning: "#f59e0b",
  offline: "#ef4444",
};

export function FactoryDetail({ factory, onClose }: FactoryDetailProps) {
  const { factoryStreams } = useAppStore();
  const color = statusColor[factory.status];
  const streamData = factoryStreams[factory.id] ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong border border-slate-700/40 rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b border-slate-800/60"
        style={{ background: `${color}08` }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: color }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color }}
              >
                {factory.status}
              </span>
            </div>
            <h3 className="text-white font-black text-base leading-tight">
              {factory.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={11} className="text-slate-500" />
              <span className="text-xs text-slate-500">{factory.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Efficiency rings */}
      <div className="px-5 py-4 grid grid-cols-2 gap-4 border-b border-slate-800/60">
        <div className="flex flex-col items-center gap-1">
          <EfficiencyRing value={factory.efficiency} color={color} />
          <p className="text-xs text-slate-500 text-center">Efficiency</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <EfficiencyRing value={factory.carbonCredit} color="#10b981" />
          <p className="text-xs text-slate-500 text-center">Carbon Credits</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 py-2 flex-1">
        <StatRow
          icon={Zap}
          label="Output"
          value={factory.output}
          color={color}
        />
        <StatRow
          icon={TrendingDown}
          label="CO₂ Saved"
          value={`${factory.co2Saved.toLocaleString()} t`}
          color="#10b981"
        />
        <StatRow
          icon={Thermometer}
          label="Temperature"
          value={`${factory.temperature}°C`}
          color="#60a5fa"
        />
        <StatRow
          icon={Clock}
          label="Uptime (30d)"
          value={`${factory.uptime}%`}
          color="#94a3b8"
        />
        <StatRow
          icon={Award}
          label="Carbon Density"
          value={`${factory.carbonDensity}%`}
          color={
            factory.carbonDensity > 60
              ? "#ef4444"
              : factory.carbonDensity > 35
                ? "#f59e0b"
                : "#10b981"
          }
        />
      </div>

      {/* Warning badge */}
      {factory.status !== "online" && (
        <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle size={13} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">
            {factory.status === "offline"
              ? "Facility offline — maintenance required"
              : "Emissions above threshold — investigation needed"}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => exportEnergyJSON(factory.name, streamData)}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
        >
          <ArrowUpRight size={12} />
          Export JSON
        </button>
        <button
          onClick={() => {
            const report = {
              generatedAt: new Date().toISOString(),
              facility: {
                id: factory.id,
                name: factory.name,
                location: factory.location,
                country: factory.country,
                status: factory.status,
                output: factory.output,
                efficiency: factory.efficiency,
                carbonCredit: factory.carbonCredit,
                carbonDensity: factory.carbonDensity,
                co2Saved: factory.co2Saved,
                temperature: factory.temperature,
                uptime: factory.uptime,
              },
              complianceScore: Math.round(factory.efficiency * 0.9),
              energyStream: streamData,
              summary: {
                avgEnergy: streamData.length
                  ? Math.round(
                      streamData.reduce((s, p) => s + p.energy, 0) /
                        streamData.length,
                    )
                  : 0,
                avgCarbon: streamData.length
                  ? Math.round(
                      streamData.reduce((s, p) => s + p.carbon, 0) /
                        streamData.length,
                    )
                  : 0,
                avgEfficiency: streamData.length
                  ? Math.round(
                      streamData.reduce((s, p) => s + p.efficiency, 0) /
                        streamData.length,
                    )
                  : 0,
              },
            };
            const json = JSON.stringify(report, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${factory.name.replace(/\s+/g, "-").toLowerCase()}-full-report-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 text-xs font-semibold transition-all"
        >
          <Factory size={12} />
          Full Report
        </button>
      </div>
    </motion.div>
  );
}

export function FactoryDetailPanel() {
  const { selectedFactory, setSelectedFactory } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      {selectedFactory && (
        <FactoryDetail
          key={selectedFactory.id}
          factory={selectedFactory}
          onClose={() => setSelectedFactory(null)}
        />
      )}
    </AnimatePresence>
  );
}

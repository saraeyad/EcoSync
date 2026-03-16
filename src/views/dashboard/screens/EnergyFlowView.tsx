import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, TrendingUp, TrendingDown, Flame } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppStore } from "../../../hooks/useStore.ts";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";
import { FlipNumber } from "../../../components/ui/FlipNumber.tsx";

function EnergyBar({
  name,
  output,
  efficiency,
  color,
}: {
  name: string;
  output: string;
  efficiency: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-slate-400 w-32 truncate shrink-0">{name}</p>
      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${efficiency}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {output}
      </span>
    </div>
  );
}

export function EnergyFlowView() {
  const { factories, factoryStreams, pushFactoryPoint } = useAppStore();

  const tick = useCallback(() => {
    factories
      .filter((f) => f.status === "online")
      .forEach((f) => pushFactoryPoint(f.id));
  }, [factories, pushFactoryPoint]);

  useEffect(() => {
    const id = setInterval(tick, 4500);
    return () => clearInterval(id);
  }, [tick]);

  const totalOutput = factories
    .filter((f) => f.status === "online")
    .reduce((s, f) => s + parseFloat(f.output), 0)
    .toFixed(1);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap size={18} className="text-emerald-400" />
        <h1 className="text-xl font-black text-white">Energy Flow</h1>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
          Live Feed
        </span>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Output",
            value: `${totalOutput} GW`,
            icon: Zap,
            color: "#10b981",
          },
          {
            label: "Peak Demand",
            value: "4.0 GW",
            icon: TrendingUp,
            color: "#34d399",
          },
          {
            label: "Carbon Savings",
            value: "3,421 t",
            icon: TrendingDown,
            color: "#6ee7b7",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bento-card flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl shrink-0"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}25`,
              }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-slate-500 text-xs">{label}</p>
              <p className="text-lg font-black text-white">
                <FlipNumber value={value} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Per-factory live charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {factories
          .filter((f) => f.status !== "offline")
          .map((factory, i) => {
            const stream = factoryStreams[factory.id] ?? [];
            const latest = stream[stream.length - 1];
            return (
              <ScrollReveal key={factory.id} delay={i * 0.04}>
                <div className="bento-card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-bold text-sm">
                        {factory.name}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {factory.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-black tabular-nums">
                        {factory.output}
                      </p>
                      {latest && (
                        <p className="text-xs text-slate-500">
                          eff.{" "}
                          <span className="text-emerald-300">
                            {latest.efficiency.toFixed(0)}%
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={90}>
                    <LineChart data={stream}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: 8,
                          fontSize: 10,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="energy"
                        stroke="#10b981"
                        strokeWidth={1.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#34d399"
                        strokeWidth={1}
                        dot={false}
                        strokeDasharray="4 2"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ScrollReveal>
            );
          })}

        {/* Offline factory placeholder */}
        {factories
          .filter((f) => f.status === "offline")
          .map((factory) => (
            <div
              key={factory.id}
              className="bento-card flex items-center gap-4 opacity-50"
            >
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <Flame size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{factory.name}</p>
                <p className="text-red-400 text-xs font-semibold">
                  Offline — No data stream
                </p>
                <p className="text-slate-600 text-xs">{factory.location}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Output bars */}
      <ScrollReveal delay={0.1}>
        <div className="bento-card">
          <h3 className="text-white font-bold text-sm mb-4">
            Output Comparison
          </h3>
          <div className="flex flex-col gap-3">
            {factories.map((f, i) => (
              <EnergyBar
                key={f.id}
                name={f.name.split(" ").slice(0, 2).join(" ")}
                output={f.output}
                efficiency={f.efficiency}
                color={
                  [
                    "#10b981",
                    "#34d399",
                    "#6ee7b7",
                    "#059669",
                    "#0d9488",
                    "#14b8a6",
                    "#a7f3d0",
                    "#047857",
                  ][i % 8]
                }
              />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

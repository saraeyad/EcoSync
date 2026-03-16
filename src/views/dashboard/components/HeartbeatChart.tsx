import { useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  type TooltipProps,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../../hooks/useStore.ts";
import type { EnergyDataPoint, Factory } from "../../../types/index.ts";
import { Activity, Zap } from "lucide-react";

interface TTEntry {
  dataKey?: string;
  color?: string;
  value?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string> & { payload?: TTEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 border border-slate-700 text-xs shadow-xl min-w-[120px]">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {(payload as TTEntry[]).map((p) => (
        <div
          key={String(p.dataKey)}
          className="flex items-center justify-between gap-4 mb-1"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-slate-300 capitalize">
              {String(p.dataKey)}
            </span>
          </div>
          <span className="text-white font-bold">{p.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

interface HeartbeatChartProps {
  factory?: Factory | null;
}

export function HeartbeatChart({ factory }: HeartbeatChartProps) {
  const {
    factoryStreams,
    globalEnergyData,
    pushFactoryPoint,
    pushGlobalPoint,
  } = useAppStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const data: EnergyDataPoint[] = factory
    ? (factoryStreams[factory.id] ?? globalEnergyData)
    : globalEnergyData;

  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const delta = prev ? ((latest?.energy ?? 0) - prev.energy).toFixed(1) : "0";
  const isUp = parseFloat(delta) >= 0;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (factory) pushFactoryPoint(factory.id);
      else pushGlobalPoint();
    }, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [factory?.id]);

  const accentColor = factory
    ? factory.status === "offline"
      ? "#ef4444"
      : factory.status === "warning"
        ? "#f59e0b"
        : "#10b981"
    : "#10b981";

  return (
    <div className="bento-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} style={{ color: accentColor }} />
          <div>
            <AnimatePresence mode="wait">
              <motion.h3
                key={factory?.id ?? "global"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="text-white font-bold text-sm"
              >
                {factory
                  ? `${factory.name} — Live Feed`
                  : "Global Energy Stream"}
              </motion.h3>
            </AnimatePresence>
            <p className="text-slate-500 text-xs">
              Updates every 2s · Sliding window
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <motion.p
              key={latest?.energy}
              initial={{ scale: 1.2, color: accentColor }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-black tabular-nums"
            >
              {latest?.energy?.toFixed(1) ?? "--"}%
            </motion.p>
            <p className="text-xs text-slate-500">Energy Load</p>
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${isUp ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}
          >
            <Zap size={12} />
            {isUp ? "+" : ""}
            {delta}%
          </div>
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
          >
            <defs>
              <linearGradient
                id={`grad-${accentColor}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="carbonGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "#475569", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[20, 105]}
              tick={{ fill: "#475569", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={90}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: "90%", fill: "#f59e0b", fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="carbon"
              stroke="#475569"
              strokeWidth={1}
              fill="url(#carbonGrad2)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="energy"
              stroke={accentColor}
              strokeWidth={2.5}
              fill={`url(#grad-${accentColor})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: accentColor,
                strokeWidth: 2,
                stroke: "#020617",
              }}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Live pulse indicator */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/40">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: accentColor }}
        />
        <span className="text-xs text-slate-500">
          Efficiency:{" "}
          <span className="font-semibold" style={{ color: accentColor }}>
            {latest?.efficiency?.toFixed(1)}%
          </span>
          <span className="mx-2 text-slate-700">|</span>
          Carbon Index:{" "}
          <span className="font-semibold text-slate-300">
            {latest?.carbon?.toFixed(1)}%
          </span>
        </span>
      </div>
    </div>
  );
}

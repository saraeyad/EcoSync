import { useEffect, useCallback } from "react";
import { BarChart3, TrendingUp, Zap, TrendingDown } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppStore } from "../../../hooks/useStore.ts";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";
import { CHART_COLORS } from "../../../config/theme.ts";

function StatBadge({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bento-card flex flex-col gap-1">
      <p className="text-slate-500 text-xs font-medium">{label}</p>
      <p className="text-2xl font-black" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-slate-600 text-xs">{sub}</p>}
    </div>
  );
}

export function AnalyticsView() {
  const { factories, globalEnergyData, pushGlobalPoint } = useAppStore();

  const tick = useCallback(() => pushGlobalPoint(), [pushGlobalPoint]);
  useEffect(() => {
    const id = setInterval(tick, 4500);
    return () => clearInterval(id);
  }, [tick]);

  const onlineFacs = factories.filter((f) => f.efficiency > 0);
  const avgEff = onlineFacs.length
    ? Math.round(
        onlineFacs.reduce((s, f) => s + f.efficiency, 0) / onlineFacs.length,
      )
    : 0;

  const efficiencyData = factories.map((f) => ({
    name: f.name.split(" ").slice(0, 2).join(" "),
    efficiency: f.efficiency,
    carbon: f.carbonDensity,
    uptime: f.uptime,
  }));

  const co2Data = [...factories]
    .sort((a, b) => b.co2Saved - a.co2Saved)
    .map((f) => ({
      name: f.name.split(" ").slice(0, 2).join(" "),
      saved: f.co2Saved,
    }));

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 size={18} className="text-emerald-400" />
        <h1 className="text-xl font-black text-white">Analytics</h1>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
          Live
        </span>
      </div>

      {/* Quick stat row */}
      <ScrollReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatBadge
            label="Avg. Efficiency"
            value={`${avgEff}%`}
            sub="across online"
            color="#10b981"
          />
          <StatBadge
            label="Total CO₂ Saved"
            value="95.7K t"
            sub="this month"
            color="#34d399"
          />
          <StatBadge
            label="Peak Output"
            value="4.0 GW"
            sub="Oslo Hydro Grid"
            color="#6ee7b7"
          />
          <StatBadge
            label="Online Rate"
            value={`${Math.round((onlineFacs.length / factories.length) * 100)}%`}
            sub={`${onlineFacs.length} of ${factories.length} online`}
            color="#a7f3d0"
          />
        </div>
      </ScrollReveal>

      {/* Live global stream */}
      <ScrollReveal delay={0.05}>
        <div className="bento-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-emerald-400" />
            <h3 className="text-white font-bold text-sm">
              Global Energy Stream
            </h3>
            <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
              Live
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={globalEnergyData}>
              <defs>
                <linearGradient id="aEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="time"
                tick={{ fill: "#475569", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "10px",
                  fontSize: 11,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="#10b981"
                fill="url(#aEnergy)"
                strokeWidth={2}
                dot={false}
                name="Energy %"
              />
              <Area
                type="monotone"
                dataKey="carbon"
                stroke="#ef4444"
                fill="url(#aCarbon)"
                strokeWidth={1.5}
                dot={false}
                name="Carbon %"
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="#6ee7b7"
                fill="none"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="5 3"
                name="Efficiency %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ScrollReveal>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal delay={0.08}>
          <div className="bento-card">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-emerald-400" />
              <h3 className="text-white font-bold text-sm">
                Efficiency by Facility
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={efficiencyData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "#475569", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    fontSize: 11,
                  }}
                />
                <Bar
                  dataKey="efficiency"
                  radius={[0, 4, 4, 0]}
                  name="Efficiency %"
                >
                  {efficiencyData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bento-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={14} className="text-emerald-400" />
              <h3 className="text-white font-bold text-sm">
                CO₂ Saved Leaderboard (t)
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={co2Data} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#475569", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    fontSize: 11,
                  }}
                />
                <Bar
                  dataKey="saved"
                  fill="#34d399"
                  radius={[0, 4, 4, 0]}
                  name="CO₂ Saved (t)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

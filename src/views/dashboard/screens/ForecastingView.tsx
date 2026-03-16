import { TrendingUp, Target, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";

// Generate synthetic 12-month forecast
function buildForecast() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let actual = 420, projected = 420;
  return months.map((m, i) => {
    actual    = i < 6 ? actual    + (Math.random() - 0.48) * 30 : null as unknown as number;
    projected = projected + (Math.random() - 0.52) * 25;
    return {
      month:     m,
      actual:    i < 6 ? Math.round(actual)    : undefined,
      projected: Math.round(projected),
      target:    380,
    };
  });
}

const forecastData    = buildForecast();
const netZeroProgress = 62; // % toward 2030 net-zero

const milestones = [
  { year: "2024", label: "Carbon baseline established",  done: true  },
  { year: "2025", label: "25% emission reduction target", done: true  },
  { year: "2026", label: "Renewable energy at 60%",       done: false },
  { year: "2028", label: "Carbon-neutral supply chain",   done: false },
  { year: "2030", label: "Net-Zero milestone",            done: false },
];

export function ForecastingView() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp size={18} className="text-emerald-400" />
        <h1 className="text-xl font-black text-white">Forecasting</h1>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">2030 Target</span>
      </div>

      {/* Progress toward net-zero */}
      <ScrollReveal>
        <div className="bento-card relative overflow-hidden">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-emerald-400" />
            <h3 className="text-white font-bold text-sm">Net-Zero 2030 Progress</h3>
          </div>
          <p className="text-slate-500 text-xs mb-4">Current trajectory based on 8 facilities</p>

          <div className="flex items-end gap-4 mb-3">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-black text-emerald-400"
            >
              {netZeroProgress}%
            </motion.span>
            <p className="text-slate-400 text-sm mb-2">of required emission reductions achieved</p>
          </div>

          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${netZeroProgress}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #059669, #10b981, #34d399)" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-600">2020 Baseline</span>
            <span className="text-xs text-emerald-500 font-semibold">2030 Net-Zero</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Forecast chart */}
      <ScrollReveal delay={0.05}>
        <div className="bento-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={14} className="text-emerald-400" />
            <h3 className="text-white font-bold text-sm">12-Month Emission Forecast (kt CO₂e)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="fActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="fProj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6ee7b7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={380} stroke="#10b981" strokeDasharray="6 3" label={{ value: "Target", fill: "#10b981", fontSize: 10 }} />
              <Area type="monotone" dataKey="actual"    stroke="#10b981" fill="url(#fActual)" strokeWidth={2}   dot={{ r: 3, fill: "#10b981" }} name="Actual" connectNulls={false} />
              <Area type="monotone" dataKey="projected" stroke="#6ee7b7" fill="url(#fProj)"  strokeWidth={1.5} dot={false} strokeDasharray="5 3" name="Projected" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ScrollReveal>

      {/* Net-zero timeline */}
      <ScrollReveal delay={0.08}>
        <div className="bento-card">
          <h3 className="text-white font-bold text-sm mb-5">Net-Zero Roadmap</h3>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-800" />
            <div className="flex flex-col gap-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 relative"
                >
                  {/* Dot */}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                    m.done
                      ? "bg-emerald-500/20 border-emerald-500"
                      : "bg-slate-800 border-slate-600"
                  }`}>
                    {m.done
                      ? <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      : <div className="w-2 h-2 rounded-full bg-slate-600" />
                    }
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-bold ${m.done ? "text-white" : "text-slate-500"}`}>{m.label}</p>
                      <p className="text-xs text-slate-600">{m.year}</p>
                    </div>
                    {m.done && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold">
                        Complete
                      </span>
                    )}
                    {!m.done && (
                      <ChevronRight size={14} className="text-slate-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

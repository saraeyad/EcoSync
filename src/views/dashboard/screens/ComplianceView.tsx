import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo } from "react";
import { useAppStore } from "../../../hooks/useStore.ts";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";
import type { ComplianceStandard } from "../../../lib/supabase-mappers.ts";

function ComplianceRow({ standard }: { standard: ComplianceStandard }) {
  const pct = Math.round((standard.pass / standard.total) * 100);
  const isGreen = pct >= 80;
  const isYellow = pct >= 60 && pct < 80;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-800/60 last:border-0">
      <div
        className={`p-2 rounded-xl shrink-0 ${isGreen ? "bg-emerald-500/10" : isYellow ? "bg-amber-500/10" : "bg-red-500/10"}`}
      >
        {isGreen ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : isYellow ? (
          <AlertCircle size={16} className="text-amber-400" />
        ) : (
          <XCircle size={16} className="text-red-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white font-bold text-sm">{standard.label}</p>
          <span
            className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
              isGreen
                ? "bg-emerald-500/15 text-emerald-400"
                : isYellow
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-red-500/15 text-red-400"
            }`}
          >
            {pct}%
          </span>
        </div>
        <p className="text-slate-500 text-xs">{standard.desc}</p>
        <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="h-full rounded-full"
            style={{
              background: isGreen
                ? "#10b981"
                : isYellow
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          />
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-white text-sm font-bold">
          {standard.pass}/{standard.total}
        </p>
        <p className="text-slate-600 text-xs">facilities</p>
      </div>
    </div>
  );
}

export function ComplianceView() {
  const { factories, complianceStandards } = useAppStore();
  const standards = complianceStandards;
  const radarData = useMemo(
    () =>
      standards.map((s) => ({
        subject: s.label,
        score: Math.round((s.pass / s.total) * 100),
      })),
    [standards],
  );
  const passing = standards.filter(
    (s) => s.total > 0 && s.pass / s.total >= 0.8,
  ).length;
  const avgPct =
    standards.length > 0
      ? Math.round(
          (standards.reduce(
            (sum, r) => sum + (r.total > 0 ? r.pass / r.total : 0),
            0,
          ) /
            standards.length) *
            100,
        )
      : 0;

  if (standards.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <h1 className="text-xl font-black text-white">Compliance</h1>
        </div>
        <div className="bento-card text-center py-12">
          <p className="text-slate-400">
            No compliance standards loaded. Add data to the{" "}
            <code className="text-slate-300">compliance_standards</code> table
            in Supabase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <h1 className="text-xl font-black text-white">Compliance</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const rows = [
              [
                "Standard",
                "Description",
                "Passing Facilities",
                "Total Facilities",
                "Score %",
              ],
              ...standards.map((s) => [
                s.label,
                s.desc,
                s.pass.toString(),
                s.total.toString(),
                Math.round((s.pass / s.total) * 100).toString(),
              ]),
            ];
            const csv = rows.map((r) => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ecosync-compliance-report-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold"
        >
          <Download size={14} /> Export Reports
        </motion.button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Standards Passing",
            value: `${passing}/${standards.length}`,
            color: "#10b981",
          },
          { label: "Avg. Compliance", value: `${avgPct}%`, color: "#34d399" },
          { label: "Reports Pending", value: "2", color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bento-card text-center">
            <p className="text-2xl font-black mb-1" style={{ color }}>
              {value}
            </p>
            <p className="text-slate-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Grid: radar + per-standard rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal>
          <div className="bento-card">
            <h3 className="text-white font-bold text-sm mb-4">
              Compliance Radar
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="bento-card">
            <h3 className="text-white font-bold text-sm mb-2">
              Standards Overview
            </h3>
            {standards.map((s) => (
              <ComplianceRow key={s.id} standard={s} />
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Per-facility compliance */}
      <ScrollReveal delay={0.08}>
        <div className="bento-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={14} className="text-emerald-400" />
            <h3 className="text-white font-bold text-sm">
              Facility Compliance Status
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {factories.map((f) => {
              const score =
                f.efficiency > 0 ? Math.round(f.efficiency * 0.9) : 0;
              const color =
                score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
              return (
                <div
                  key={f.id}
                  className="p-3 rounded-xl glass border border-slate-700/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white font-semibold truncate">
                      {f.name.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <span className="text-xs font-bold" style={{ color }}>
                      {score}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 capitalize">
                    {f.status}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

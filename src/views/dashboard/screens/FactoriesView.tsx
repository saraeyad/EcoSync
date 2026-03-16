import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Factory, Plus, Download, Search, Filter } from "lucide-react";
import { FactoryFlipCard } from "../components/FactoryFlipCard.tsx";
import { FactoryDetailPanel } from "../components/FactoryDetail.tsx";
import { AlertsPanel } from "../components/AlertsPanel.tsx";
import { useAppStore } from "../../../hooks/useStore.ts";
import { exportToCSV } from "../../../lib/exportUtils.ts";
import type { FactoryStatus } from "../../../types/index.ts";

const statusColors: Record<FactoryStatus, string> = {
  online: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  offline: "bg-red-500/15    text-red-400     border-red-500/25",
  warning: "bg-amber-500/15  text-amber-400   border-amber-500/25",
};

export function FactoriesView() {
  const { factories, selectedFactory, setActiveNav } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setFilter] = useState<FactoryStatus | "all">("all");

  const filtered = factories.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    online: factories.filter((f) => f.status === "online").length,
    warning: factories.filter((f) => f.status === "warning").length,
    offline: factories.filter((f) => f.status === "offline").length,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Factory size={18} className="text-emerald-400" />
            <h1 className="text-xl font-black text-white">
              Facility Management
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            {factories.length} facilities registered · {counts.online} online ·{" "}
            {counts.warning} warning · {counts.offline} offline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => exportToCSV(factories)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-slate-700/50 text-slate-300 hover:text-white text-sm font-medium transition-all"
          >
            <Download size={14} /> Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveNav("settings")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold transition-all"
          >
            <Plus size={14} /> Add Facility
          </motion.button>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {(["online", "warning", "offline"] as FactoryStatus[]).map((s) => (
          <motion.button
            key={s}
            onClick={() => setFilter(statusFilter === s ? "all" : s)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`bento-card flex items-center gap-3 cursor-pointer transition-all ${
              statusFilter === s ? "ring-1 ring-emerald-500/40" : ""
            }`}
          >
            <div
              className={`px-3 py-1 rounded-full border text-xs font-bold capitalize ${statusColors[s]}`}
            >
              {s}
            </div>
            <span className="text-2xl font-black text-white">{counts[s]}</span>
            <span className="text-slate-500 text-xs">facilities</span>
          </motion.button>
        ))}
      </div>

      {/* Search & filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facility or location…"
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/40 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Filter size={12} />
          {filtered.length} shown
        </div>
      </div>

      {/* Two-column: cards + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Flip cards grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((f, i) => (
                <FactoryFlipCard key={f.id} factory={f} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="col-span-2 py-16 text-center text-slate-600 text-sm">
                No facilities match your search.
              </div>
            )}
          </div>
        </div>

        {/* Detail / alerts panel */}
        <div>
          <AnimatePresence mode="wait">
            {selectedFactory ? (
              <FactoryDetailPanel key="detail" />
            ) : (
              <motion.div
                key="alerts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AlertsPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

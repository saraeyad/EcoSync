import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Filter,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAppStore, type AlertType } from "../../../hooks/useStore.ts";

const iconMap: Record<
  AlertType,
  { icon: typeof AlertTriangle; color: string; bg: string; border: string }
> = {
  warning: {
    icon: AlertTriangle,
    color: "#f59e0b",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
  },
  success: {
    icon: CheckCircle2,
    color: "#10b981",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/20",
  },
  info: {
    icon: Info,
    color: "#60a5fa",
    bg: "bg-blue-500/8",
    border: "border-blue-500/20",
  },
};

export function AlertsView() {
  const { alerts, dismissAlert } = useAppStore();
  const [filter, setFilter] = useState<AlertType | "all">("all");

  const visible =
    filter === "all" ? alerts : alerts.filter((a) => a.type === filter);

  const counts = {
    all: alerts.length,
    warning: alerts.filter((a) => a.type === "warning").length,
    success: alerts.filter((a) => a.type === "success").length,
    info: alerts.filter((a) => a.type === "info").length,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-emerald-400" />
          <h1 className="text-xl font-black text-white">Notifications</h1>
          {alerts.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </div>
        {alerts.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => alerts.forEach((a) => dismissAlert(a.id))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-slate-700/40 text-slate-400 hover:text-red-400 text-xs font-medium transition-colors"
          >
            <Trash2 size={12} /> Clear all
          </motion.button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={13} className="text-slate-500" />
        {(["all", "warning", "success", "info"] as const).map((t) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border transition-all ${
              filter === t
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "glass border-slate-700/40 text-slate-500 hover:text-slate-300"
            }`}
          >
            {t} ({counts[t]})
          </motion.button>
        ))}
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <AnimatePresence mode="popLayout">
          {visible.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <CheckCircle2
                size={36}
                className="text-emerald-500/30 mx-auto mb-3"
              />
              <p className="text-slate-500 text-sm">
                All clear — no active alerts
              </p>
            </motion.div>
          )}

          {visible.map(({ id, type, message, time }, i) => {
            const { icon: Icon, color, bg, border } = iconMap[type];
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`flex items-start gap-4 p-4 rounded-2xl border ${bg} ${border} group`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {message}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">{time}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dismissAlert(id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-700/50 transition-all shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <X size={13} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAppStore, type AlertType } from "../../../hooks/useStore.ts";

const iconMap: Record<
  AlertType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  warning: { icon: AlertTriangle, color: "#f59e0b", bg: "#f59e0b15" },
  success: { icon: CheckCircle2, color: "#10b981", bg: "#10b98115" },
  info: { icon: Info, color: "#60a5fa", bg: "#60a5fa15" },
};

export function AlertsPanel() {
  const { alerts } = useAppStore();

  return (
    <div className="bento-card">
      <h3 className="text-white font-bold text-sm mb-4">System Alerts</h3>
      <div className="flex flex-col gap-2.5">
        {alerts.map(({ id, type, message, time }, i) => {
          const { icon: Icon, color, bg } = iconMap[type];
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-700/40 hover:border-slate-600/50 transition-colors group"
              style={{ background: bg }}
            >
              <Icon size={14} style={{ color }} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {message}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{time}</p>
              </div>
              <button className="text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                <X size={12} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

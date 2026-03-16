import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
} from "lucide-react";
import { useAppStore, type AlertType } from "../../../hooks/useStore.ts";

const iconMap: Record<
  AlertType,
  { icon: typeof Bell; color: string; bg: string }
> = {
  warning: { icon: AlertTriangle, color: "#f59e0b", bg: "#f59e0b12" },
  success: { icon: CheckCircle2, color: "#10b981", bg: "#10b98112" },
  info: { icon: Info, color: "#60a5fa", bg: "#60a5fa12" },
};

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({
  open,
  onClose,
}: NotificationsDrawerProps) {
  const { alerts, dismissAlert, setActiveNav } = useAppStore();

  const handleViewAll = () => {
    setActiveNav("alerts");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 h-fit glass-strong border-l rounded-l-xl border-slate-800/60 flex flex-col"
          >
            {/* Header */}
            <div className="h-16 flex items-center px-5 border-b border-slate-800/60 shrink-0">
              <div className="flex items-center gap-2 flex-1">
                <Bell size={16} className="text-emerald-400" />
                <span className="text-white font-bold">Notifications</span>
                {alerts.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Alert list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
              <AnimatePresence mode="popLayout">
                {alerts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <CheckCircle2
                      size={32}
                      className="text-emerald-500/30 mb-3"
                    />
                    <p className="text-slate-500 text-sm">All clear!</p>
                  </motion.div>
                )}
                {alerts.map(({ id, type, message, time }, i) => {
                  const { icon: Icon, color, bg } = iconMap[type];
                  return (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: 40,
                        transition: { duration: 0.2 },
                      }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3 p-3 rounded-xl border border-slate-700/40 group"
                      style={{ background: bg }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: `${color}18`,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        <Icon size={14} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {message}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">{time}</p>
                      </div>
                      <button
                        onClick={() => dismissAlert(id)}
                        className="text-slate-700 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5"
                      >
                        <X size={11} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/60 shrink-0">
              <button
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-slate-700/40 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 text-sm font-medium transition-all"
              >
                View all notifications <ChevronRight size={13} />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

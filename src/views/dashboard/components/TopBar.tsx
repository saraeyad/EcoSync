import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  RefreshCw,
  Server,
  Factory,
  Leaf,
  Menu,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../hooks/useStore.ts";
import { FlipNumber } from "../../../components/ui/FlipNumber.tsx";
import { NotificationsDrawer } from "./NotificationsDrawer.tsx";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PulseStat {
  icon: typeof Server;
  label: string;
  value: string;
  color: string;
  status: "online" | "warn" | "crit";
}

const statusDot: Record<PulseStat["status"], string> = {
  online: "#10b981",
  warn: "#f59e0b",
  crit: "#ef4444",
};

// ── Live pulse indicator ──────────────────────────────────────────────────────
function PulseIndicator({ stat }: { stat: PulseStat }) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 350);
      },
      2800 + Math.random() * 2000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      animate={flicker ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 0.35 }}
      className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-slate-700/40 relative overflow-hidden"
    >
      <AnimatePresence>
        {flicker && (
          <motion.div
            key="shimmer"
            className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: `${stat.color}18` }}
          />
        )}
      </AnimatePresence>

      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${stat.color}15` }}
      >
        <stat.icon size={11} style={{ color: stat.color }} />
      </div>

      <div>
        <p className="text-[10px] text-slate-500 leading-none">{stat.label}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span
            className="w-1 h-1 rounded-full shrink-0"
            style={{
              background: statusDot[stat.status],
              boxShadow: `0 0 4px ${statusDot[stat.status]}`,
            }}
          />
          <FlipNumber
            value={stat.value}
            className="text-[11px] font-bold text-white leading-none"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Account dropdown ──────────────────────────────────────────────────────────
function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { currentUser, setActiveNav } = useAppStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${open ? "bg-slate-800 ring-1 ring-emerald-500/30" : "hover:bg-slate-800"}`}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-black text-slate-900 shrink-0">
          {currentUser.initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-white leading-tight">
            {currentUser.name}
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">
            {currentUser.email}
          </p>
        </div>
        <ChevronDown
          size={13}
          className={`hidden sm:block text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-64 glass-strong border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-black text-slate-900">
                  {currentUser.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />{" "}
                    Pro Plan
                  </span>
                </div>
              </div>
            </div>

            {/* View Profile */}
            <div className="p-2">
              <motion.button
                onClick={() => {
                  setActiveNav("profile");
                  setOpen(false);
                }}
                whileHover={{ x: 2 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-800/70 transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                  <User
                    size={13}
                    className="text-slate-400 group-hover:text-emerald-400 transition-colors"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors leading-tight">
                    View Profile
                  </p>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    {currentUser.name} · Admin
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Sign out */}
            <div className="px-2 pb-2 border-t border-slate-800/60 pt-2">
              <motion.button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                whileHover={{ x: 2 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-red-500/8 transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-colors">
                  <LogOut
                    size={13}
                    className="text-slate-400 group-hover:text-red-400 transition-colors"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 group-hover:text-red-400 transition-colors leading-tight">
                    Sign Out
                  </p>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    Return to login screen
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────
export function TopBar() {
  const {
    factories,
    alerts,
    toggleMobileSidebar,
    pushGlobalPoint,
    pushFactoryPoint,
  } = useAppStore();
  const [spinning, setSpinning] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const stopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [co2, setCo2] = useState("1,247");
  useEffect(() => {
    const id = setInterval(() => {
      setCo2((1230 + Math.floor(Math.random() * 50)).toLocaleString());
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const pulseStats: PulseStat[] = [
    {
      icon: Server,
      label: "Server Health",
      value: "99.8%",
      color: "#10b981",
      status: "online",
    },
    {
      icon: Factory,
      label: "Active Factories",
      value: "439",
      color: "#34d399",
      status: "online",
    },
    {
      icon: Leaf,
      label: "CO₂ Offset (t/hr)",
      value: co2,
      color: "#6ee7b7",
      status: "online",
    },
  ];

  const handleRefresh = useCallback(() => {
    if (spinning) return;
    setSpinning(true);

    const burst = () => {
      pushGlobalPoint();
      factories.forEach((f) => pushFactoryPoint(f.id));
    };
    burst();
    const mid = setTimeout(burst, 400);

    stopRef.current = setTimeout(() => {
      clearTimeout(mid);
      setSpinning(false);
    }, 900);
  }, [spinning, pushGlobalPoint, pushFactoryPoint]);

  useEffect(
    () => () => {
      if (stopRef.current) clearTimeout(stopRef.current);
    },
    [],
  );

  return (
    <header className="h-16 glass-strong border-b border-slate-800/60 flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-30">
      {/* Mobile hamburger */}
      <motion.button
        onClick={toggleMobileSidebar}
        whileTap={{ scale: 0.9 }}
        className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all shrink-0"
      >
        <Menu size={18} />
      </motion.button>

      {/* Search */}
      <div className="relative max-w-xs w-full shrink-0 hidden sm:block">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search facilities…"
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/40 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 focus:bg-slate-800/80 transition-all"
        />
      </div>

      {/* Live pulse stats */}
      <div className="flex items-center gap-2 flex-1">
        {pulseStats.map((s) => (
          <PulseIndicator key={s.label} stat={s} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Refresh */}
        <motion.button
          onClick={handleRefresh}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Refresh data"
          className={`p-2 rounded-xl transition-all ${spinning ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800"}`}
        >
          <RefreshCw size={15} className={spinning ? "animate-spin" : ""} />
        </motion.button>

        {/* Notifications */}
        <motion.button
          onClick={() => setNotifOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all"
        >
          <Bell size={15} />
          {alerts.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {alerts.length}
            </motion.span>
          )}
        </motion.button>

        <NotificationsDrawer
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
        />

        <div className="w-px h-4 bg-slate-700/80 mx-1" />

        {/* Account */}
        <AccountMenu />
      </div>
    </header>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Leaf, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../hooks/useStore.ts";
import { cn } from "../../../lib/utils.ts";
import {
  NAV_ITEMS,
  BOTTOM_NAV_ITEMS,
  type NavItem,
} from "../../../constants/navigation.ts";

// ── Nav button (shared desktop + mobile) ─────────────────────────────────────
interface NavBtnProps {
  item: NavItem;
  expanded: boolean; // show label text?
  onSelect?: () => void;
}

function NavBtn({ item, expanded, onSelect }: NavBtnProps) {
  const { activeNav, setActiveNav } = useAppStore();
  const isActive = activeNav === item.id;

  return (
    <div className="relative group">
      <motion.button
        onClick={() => {
          setActiveNav(item.id);
          onSelect?.();
        }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "relative w-full flex items-center rounded-xl transition-all duration-200 overflow-hidden",
          expanded ? "gap-3 px-3 py-2.5" : "justify-center p-2.5",
          isActive
            ? "text-emerald-300 border border-emerald-500/30"
            : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60",
        )}
        style={
          isActive
            ? {
                background:
                  "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.04))",
              }
            : undefined
        }
      >
        {isActive && (
          <>
            <motion.div
              layoutId="activeGlow"
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%,rgba(16,185,129,0.2),transparent 70%)",
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
            <motion.div
              layoutId="activeBar"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-full"
              style={{ boxShadow: "0 0 8px #10b981" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </>
        )}

        {/* Icon */}
        <div
          className={cn(
            "relative z-10 shrink-0 p-1 rounded-lg transition-all duration-200",
            isActive ? "bg-emerald-500/15" : "group-hover:bg-slate-700/40",
          )}
        >
          <item.icon
            size={17}
            className={cn(
              isActive &&
                "text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]",
            )}
          />
        </div>

        {/* Label */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.span
              key="label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge */}
        {item.badge != null && (
          <span
            className={cn(
              "relative z-10 min-w-4 h-4 px-1 rounded-full bg-red-500/20 text-red-400 text-[9px] font-bold flex items-center justify-center",
              expanded ? "ml-auto" : "absolute -top-0.5 -right-0.5",
            )}
          >
            {item.badge}
          </span>
        )}
      </motion.button>

      {/* Tooltip — icon-only mode only */}
      {!expanded && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg glass-strong border border-slate-700/50 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-[60] shadow-xl">
          {item.label}
          {item.badge != null && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-bold">
              {item.badge}
            </span>
          )}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-700/50" />
        </div>
      )}
    </div>
  );
}

// ── Desktop sidebar (collapsible) ─────────────────────────────────────────────
export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentUser } = useAppStore();
  const navigate = useNavigate();
  const expanded = !sidebarCollapsed;

  return (
    <motion.aside
      animate={{ width: expanded ? 220 : 60 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex flex-col glass-strong border-r border-slate-800/60 h-screen sticky top-0 z-40 shrink-0 overflow-visible"
    >
      {/* Header: logo + toggle */}
      <div className="h-16 flex items-center px-3 border-b border-slate-800/60 shrink-0 gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
          <Leaf size={16} className="text-emerald-400" />
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.span
              key="brand"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-black text-white text-base whitespace-nowrap overflow-hidden"
            >
              Eco<span className="text-emerald-400">Sync</span>
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleSidebar}
          whileTap={{ scale: 0.85 }}
          className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all shrink-0"
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronRight size={15} />
          </motion.div>
        </motion.button>
      </div>

      {/* Status pill (expanded only) */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-2 mt-2 px-3 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/20 overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium whitespace-nowrap">
                All systems operational
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 ml-3.5 whitespace-nowrap">
              439 facilities live
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-3 overflow-y-auto overflow-x-visible">
        {NAV_ITEMS.map((item) => (
          <NavBtn key={item.id} item={item} expanded={expanded} />
        ))}
      </nav>

      <div className="mx-2 border-t border-slate-800/60" />

      {/* Bottom items + avatar */}
      <div className="flex flex-col gap-1 px-2 py-3 overflow-visible">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavBtn key={item.id} item={item} expanded={expanded} />
        ))}

        {/* User / logout row */}
        <div
          className={cn(
            "relative group mt-1 flex items-center rounded-xl overflow-hidden",
            expanded ? "gap-3 px-3 py-2 glass border border-slate-700/50" : "",
          )}
        >
          <motion.button
            onClick={() => navigate("/login")}
            whileTap={{ scale: 0.92 }}
            title="Sign out"
            className={cn(
              "flex items-center transition-all",
              expanded
                ? "gap-3 w-full"
                : "w-full justify-center p-2 hover:bg-red-500/10 rounded-xl",
            )}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[10px] font-black text-slate-900 shrink-0">
              {currentUser.initials}
            </div>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="userinfo"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden min-w-0 text-left"
                >
                  <p className="text-xs font-semibold text-white whitespace-nowrap">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 whitespace-nowrap">
                    Sign out
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {expanded && (
              <LogOut
                size={13}
                className="ml-auto text-slate-500 hover:text-red-400 transition-colors shrink-0"
              />
            )}
          </motion.button>

          {/* Tooltip when collapsed */}
          {!expanded && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg glass-strong border border-slate-700/50 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-[60] shadow-xl">
              Sign Out
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-700/50" />
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

// ── Mobile: full drawer with labels ──────────────────────────────────────────
export function MobileSidebar() {
  const { sidebarMobileOpen, closeMobileSidebar, currentUser } = useAppStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {sidebarMobileOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={closeMobileSidebar}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 w-64 glass-strong border-r border-slate-800/60 flex flex-col z-50 lg:hidden"
          >
            <div className="h-16 flex items-center px-4 border-b border-slate-800/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Leaf size={16} className="text-emerald-400" />
                </div>
                <span className="font-black text-white">
                  Eco<span className="text-emerald-400">Sync</span>
                </span>
              </div>
              <button
                onClick={closeMobileSidebar}
                className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">
                  All systems operational
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-3.5">
                439 facilities live
              </p>
            </div>

            <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <NavBtn
                  key={item.id}
                  item={item}
                  expanded
                  onSelect={closeMobileSidebar}
                />
              ))}
            </nav>

            <div className="mx-3 border-t border-slate-800/60" />

            <div className="flex flex-col gap-1 px-3 py-3">
              {BOTTOM_NAV_ITEMS.map((item) => (
                <NavBtn
                  key={item.id}
                  item={item}
                  expanded
                  onSelect={closeMobileSidebar}
                />
              ))}

              <div className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl glass border border-slate-700/50">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shrink-0 flex items-center justify-center text-xs font-black text-slate-900">
                  {currentUser.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
                <motion.button
                  onClick={() => {
                    closeMobileSidebar();
                    navigate("/login");
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="ml-auto text-slate-500 hover:text-red-400 transition-colors"
                >
                  <LogOut size={14} />
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

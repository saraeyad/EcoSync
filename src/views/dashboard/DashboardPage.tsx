import { memo, useEffect, lazy, Suspense, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Factory,
  TrendingDown,
  Globe2,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { Sidebar, MobileSidebar } from "./components/Sidebar.tsx";
import { TopBar } from "./components/TopBar.tsx";
import { WorldMap } from "./components/WorldMap.tsx";
import { CarbonVaultCard } from "./components/CarbonVaultCard.tsx";
import { HeartbeatChart } from "./components/HeartbeatChart.tsx";
import { AlertsPanel } from "./components/AlertsPanel.tsx";
import { MetricCard } from "./components/MetricCard.tsx";
import { FactoryDetailPanel } from "./components/FactoryDetail.tsx";
import { FactoryFlipCard } from "./components/FactoryFlipCard.tsx";
import { BackgroundParticles } from "./components/BackgroundParticles.tsx";
import { useAppStore } from "../../hooks/useStore.ts";
import { hasSupabase } from "../../lib/supabase.ts";

// Views for each nav tab (lazy so heavy charts/maps load only when tab is opened)
const FactoriesView = lazy(() =>
  import("./screens/FactoriesView.tsx").then((m) => ({
    default: m.FactoriesView,
  })),
);
const AnalyticsView = lazy(() =>
  import("./screens/AnalyticsView.tsx").then((m) => ({
    default: m.AnalyticsView,
  })),
);
const GlobalMapView = lazy(() =>
  import("./screens/GlobalMapView.tsx").then((m) => ({
    default: m.GlobalMapView,
  })),
);
const EnergyFlowView = lazy(() =>
  import("./screens/EnergyFlowView.tsx").then((m) => ({
    default: m.EnergyFlowView,
  })),
);
const ComplianceView = lazy(() =>
  import("./screens/ComplianceView.tsx").then((m) => ({
    default: m.ComplianceView,
  })),
);
const ForecastingView = lazy(() =>
  import("./screens/ForecastingView.tsx").then((m) => ({
    default: m.ForecastingView,
  })),
);
const AlertsView = lazy(() =>
  import("./screens/AlertsView.tsx").then((m) => ({
    default: m.AlertsView,
  })),
);
const SettingsPage = lazy(() =>
  import("../settings/SettingsPage.tsx").then((m) => ({ default: m.default })),
);
const ProfilePage = lazy(() =>
  import("../profile/ProfilePage.tsx").then((m) => ({ default: m.default })),
);

// ── Shared page transition wrapper ──────────────────────────────────────────
function PageView({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Command Center metrics ───────────────────────────────────────────────────
interface Metric {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: LucideIcon;
  color: string;
}

const metrics: Metric[] = [
  {
    title: "Total Energy Load",
    value: "84.2",
    unit: "GW",
    change: 2.4,
    icon: Zap,
    color: "#10b981",
  },
  {
    title: "Active Facilities",
    value: "439",
    unit: "/ 450",
    change: -2.2,
    icon: Factory,
    color: "#34d399",
  },
  {
    title: "CO₂ Offset Today",
    value: "3,421",
    unit: "t",
    change: 5.1,
    icon: TrendingDown,
    color: "#6ee7b7",
  },
  {
    title: "Global Coverage",
    value: "62",
    unit: "countries",
    change: 1.5,
    icon: Globe2,
    color: "#a7f3d0",
  },
];

const KpiRow = memo(function KpiRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((m, i) => (
        <MetricCard key={m.title} {...m} index={i} />
      ))}
    </div>
  );
});

function CommandCenter() {
  const { factories, selectedFactory } = useAppStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Activity size={18} className="text-emerald-400" />
        <h1 className="text-xl font-black text-white">Command Center</h1>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
          LIVE
        </span>
        <AnimatePresence>
          {selectedFactory && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xs text-slate-400 ml-2"
            >
              →{" "}
              <span className="text-white font-semibold">
                {selectedFactory.name}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <KpiRow />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WorldMap />
        </div>
        <CarbonVaultCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <HeartbeatChart factory={selectedFactory} />
        </div>
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

      {/* Facility flip cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Factory size={15} className="text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Facility Grid</h2>
          <span className="text-xs text-slate-500">
            — hover to reveal details, click to drill down
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {factories.map((f, i) => (
            <FactoryFlipCard key={f.id} factory={f} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Nav → View routing map ───────────────────────────────────────────────────
function ActiveView({ navId }: { navId: string }) {
  switch (navId) {
    case "dashboard":
      return <CommandCenter />;
    case "factories":
      return <FactoriesView />;
    case "analytics":
      return <AnalyticsView />;
    case "global":
      return <GlobalMapView />;
    case "energy":
      return <EnergyFlowView />;
    case "compliance":
      return <ComplianceView />;
    case "trends":
      return <ForecastingView />;
    case "alerts":
      return <AlertsView />;
    case "settings":
      return <SettingsPage />;
    case "profile":
      return <ProfilePage />;
    default:
      return <CommandCenter />;
  }
}

// ── Supabase connection banner ───────────────────────────────────────────────
function SupabaseConnectionBanner() {
  const {
    supabaseError,
    clearSupabaseError,
    loadFactories,
    loadAlerts,
    loadCompliance,
  } = useAppStore();
  if (!supabaseError) return null;

  const retry = () => {
    clearSupabaseError();
    loadFactories();
    loadAlerts();
    loadCompliance();
  };

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
      <p className="text-amber-200 text-sm flex-1 min-w-0">
        <span className="font-semibold">Database:</span> {supabaseError}
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={retry}
          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={clearSupabaseError}
          className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-300 text-xs"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

// ── No data hint (connected but 0 rows = usually RLS blocking) ────────────────
function NoDataHint() {
  const {
    supabaseError,
    factoriesLoaded,
    factories,
    loadFactories,
    loadAlerts,
    loadCompliance,
  } = useAppStore();
  if (!hasSupabase || !factoriesLoaded || factories.length > 0 || supabaseError)
    return null;

  const retry = () => {
    loadFactories();
    loadAlerts();
    loadCompliance();
  };

  return (
    <div className="bg-sky-500/10 border-b border-sky-500/30 px-4 py-3 flex flex-wrap items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-sky-200 text-sm font-semibold">No data showing</p>
        <p className="text-sky-300/90 text-xs mt-0.5">
          Supabase is connected but returned 0 rows. Usually this is{" "}
          <strong>Row Level Security (RLS)</strong> blocking reads. In Supabase:{" "}
          <strong>Table Editor</strong> → select <strong>factories</strong> →
          click the shield icon (RLS) → turn <strong>RLS off</strong> for now,
          or add a policy: <strong>SELECT</strong> for role{" "}
          <strong>anon</strong> with <strong>USING (true)</strong>. Do the same
          for <strong>alerts</strong> and <strong>compliance_standards</strong>.
          Then click Retry.
        </p>
      </div>
      <button
        type="button"
        onClick={retry}
        className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-xs font-medium shrink-0"
      >
        Retry
      </button>
    </div>
  );
}

// ── Page root ────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const { activeNav, loadFactories, loadAlerts, loadCompliance } =
    useAppStore();

  useEffect(() => {
    loadFactories();
    loadAlerts();
    loadCompliance();
  }, [loadFactories, loadAlerts, loadCompliance]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-background overflow-hidden relative"
    >
      <BackgroundParticles />
      <MobileSidebar />
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
        <TopBar />
        <SupabaseConnectionBanner />
        <NoDataHint />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <PageView key={activeNav}>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-24">
                    <span className="text-slate-500 text-sm">Loading…</span>
                  </div>
                }
              >
                <ActiveView navId={activeNav} />
              </Suspense>
            </PageView>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}

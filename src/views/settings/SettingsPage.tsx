import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Download, Database, Factory, FileJson, X } from "lucide-react";
import { AddFactoryForm } from "../dashboard/components/AddFactoryForm.tsx";
import { exportToCSV } from "../../lib/exportUtils.ts";
import { useAppStore } from "../../hooks/useStore.ts";

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-black text-xl flex items-center gap-2">
                    <Factory size={20} className="text-emerald-400" />
                    Add New Facility
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-white transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SettingCard({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  variant = "default",
}: {
  icon: typeof Factory;
  title: string;
  description: string;
  action: () => void;
  actionLabel: string;
  variant?: "default" | "emerald" | "danger";
}) {
  const btnCls = {
    default: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    emerald: "bg-emerald-500 hover:bg-emerald-400 text-slate-900",
    danger:
      "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/25",
  }[variant];

  return (
    <div className="glass rounded-2xl p-6 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/50">
          <Icon size={20} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">{title}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{description}</p>
        </div>
      </div>
      <motion.button
        onClick={action}
        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${btnCls}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {actionLabel}
      </motion.button>
    </div>
  );
}

export default function SettingsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { factories, factoryStreams, setActiveNav } = useAppStore();

  const handleExportCSV = () => exportToCSV(factories);

  const handleExportAllJSON = () => {
    const allData = factories.map((f) => ({
      factory: f,
      energyStream: factoryStreams[f.id] ?? [],
    }));
    const json = JSON.stringify(
      { exportedAt: new Date().toISOString(), facilities: allData },
      null,
      2,
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecosync-full-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 max-w-4xl"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">
          Settings & Management
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your facility network, export data, and configure the platform.
        </p>
      </div>

      {/* Network Management */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Network Management
        </h2>
        <div className="flex flex-col gap-3">
          <SettingCard
            icon={Plus}
            title="Add New Facility"
            description="Register a new factory or energy site to your global network."
            action={() => setAddOpen(true)}
            actionLabel="+ Add Facility"
            variant="emerald"
          />
          <SettingCard
            icon={Factory}
            title="Manage Facilities"
            description={`${factories.length} facilities registered · ${factories.filter((f) => f.status === "online").length} currently online`}
            action={() => setActiveNav("factories")}
            actionLabel="View All"
          />
        </div>
      </section>

      {/* Data Export */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Data Export
        </h2>
        <div className="flex flex-col gap-3">
          <SettingCard
            icon={Download}
            title="Export Facilities CSV"
            description="Download all facility data as a spreadsheet-compatible CSV file."
            action={handleExportCSV}
            actionLabel="Download CSV"
          />
          <SettingCard
            icon={FileJson}
            title="Export Full JSON"
            description="Export all facilities + live energy stream data as a complete JSON archive."
            action={handleExportAllJSON}
            actionLabel="Download JSON"
          />
          <SettingCard
            icon={Database}
            title="Energy Stream Archive"
            description="Download the last 20 data points for each facility as compressed JSON."
            action={() => {
              const allData = factories.map((f) => ({
                factory: f.name,
                points: (factoryStreams[f.id] ?? []).slice(-20),
              }));
              const json = JSON.stringify(
                { exportedAt: new Date().toISOString(), streams: allData },
                null,
                2,
              );
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `ecosync-streams-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            actionLabel="Archive Streams"
          />
        </div>
      </section>

      {/* Platform Info */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Platform
        </h2>
        <div className="glass rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Version", value: "2.4.1" },
            { label: "Facilities", value: factories.length.toString() },
            {
              label: "Online",
              value: factories
                .filter((f) => f.status === "online")
                .length.toString(),
            },
            { label: "Stack", value: "React 19 + R3F" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-slate-500 text-xs mb-1">{label}</p>
              <p className="text-white font-bold text-sm">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Add Factory Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <AddFactoryForm onClose={() => setAddOpen(false)} />
      </Modal>
    </motion.div>
  );
}

import { Globe2, Radio } from "lucide-react";
import { WorldMap } from "../components/WorldMap.tsx";
import { FactoryDetailPanel } from "../components/FactoryDetail.tsx";
import { useAppStore } from "../../../hooks/useStore.ts";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalMapView() {
  const { factories, selectedFactory } = useAppStore();

  const online = factories.filter((f) => f.status === "online").length;
  const warning = factories.filter((f) => f.status === "warning").length;
  const offline = factories.filter((f) => f.status === "offline").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Globe2 size={18} className="text-emerald-400" />
          <h1 className="text-xl font-black text-white">Global Map</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            {factories.length} Sites
          </span>
        </div>

        {/* Live legend */}
        <div className="flex items-center gap-3">
          {[
            { color: "#10b981", label: `${online} Online` },
            { color: "#f59e0b", label: `${warning} Warning` },
            { color: "#ef4444", label: `${offline} Offline` },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
              />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-slate-700/40">
        <Radio size={13} className="text-emerald-400 animate-pulse" />
        <p className="text-xs text-slate-400">
          Click on a{" "}
          <span className="text-emerald-400 font-semibold">pulsing marker</span>{" "}
          to drill into that facility's live data and Digital Twin.
        </p>
      </div>

      {/* Map + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WorldMap />
        </div>

        <div>
          <AnimatePresence mode="wait">
            {selectedFactory ? (
              <FactoryDetailPanel key="detail" />
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bento-card h-full flex flex-col items-center justify-center text-center gap-4 py-12"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Globe2 size={24} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Select a Facility</p>
                  <p className="text-slate-500 text-sm">
                    Click any marker on the map to view live Digital Twin data
                    for that facility.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full mt-2">
                  {factories.slice(0, 4).map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 p-2 rounded-lg glass border border-slate-700/40"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            f.status === "online"
                              ? "#10b981"
                              : f.status === "warning"
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      />
                      <span className="text-xs text-slate-400 truncate">
                        {f.name.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

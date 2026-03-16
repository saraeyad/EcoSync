import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import type { Factory, FactoryStatus } from "../../../types/index.ts";
import { STATUS_COLORS, STATUS_LABELS } from "../../../config/theme.ts";
import { useAppStore } from "../../../hooks/useStore.ts";
import { Globe2, ZoomIn, ZoomOut } from "lucide-react";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const statusColor = STATUS_COLORS;
const statusLabel = STATUS_LABELS;

function PulsingMarker({
  factory,
  isSelected,
  onClick,
}: {
  factory: Factory;
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = statusColor[factory.status];

  return (
    <Marker coordinates={factory.coordinates}>
      <g onClick={onClick} style={{ cursor: "pointer" }}>
        {/* Outer pulse ring */}
        {factory.status !== "offline" && (
          <motion.circle
            r={isSelected ? 14 : 10}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            opacity={0}
            animate={{
              r: [isSelected ? 14 : 10, isSelected ? 26 : 22],
              opacity: [0.6, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {/* Second pulse */}
        {factory.status === "warning" && (
          <motion.circle
            r={10}
            fill="none"
            stroke={color}
            strokeWidth={1}
            opacity={0}
            animate={{ r: [10, 28], opacity: [0.4, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.7,
            }}
          />
        )}
        {/* Core dot */}
        <motion.circle
          r={isSelected ? 7 : 5}
          fill={color}
          stroke={isSelected ? "#ffffff" : "rgba(2,6,23,0.8)"}
          strokeWidth={isSelected ? 2 : 1.5}
          animate={{ scale: isSelected ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </g>
    </Marker>
  );
}

export function WorldMap() {
  const { factories, selectedFactory, setSelectedFactory } = useAppStore();
  const [zoom, setZoom] = useState(1);

  return (
    <div className="bento-card relative overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Globe2 size={18} className="text-emerald-400" />
          <h3 className="text-white font-bold text-base">
            Global Factory Network
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {factories.filter((f) => f.status === "online").length} /{" "}
            {factories.length} online
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Legend */}
          {(["online", "warning", "offline"] as FactoryStatus[]).map((s) => (
            <span
              key={s}
              className="flex items-center gap-1.5 text-xs text-slate-400"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: statusColor[s] }}
              />
              {statusLabel[s]}
            </span>
          ))}
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.5, 4))}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-72 bg-slate-900/40">
        <ComposableMap
          projection="geoNaturalEarth1"
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup zoom={zoom} center={[0, 20]}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#0f172a"
                    stroke="#1e293b"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#1e293b", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {factories.map((factory) => (
              <PulsingMarker
                key={factory.id}
                factory={factory}
                isSelected={selectedFactory?.id === factory.id}
                onClick={() => {
                  setSelectedFactory(
                    selectedFactory?.id === factory.id ? null : factory,
                  );
                }}
              />
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip placeholder — integrated into info bar below */}
      </div>

      {/* Selected factory info bar */}
      <AnimatePresence>
        {selectedFactory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-800/60 px-6 py-3 flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: statusColor[selectedFactory.status] }}
              />
              <span className="text-white font-semibold text-sm">
                {selectedFactory.name}
              </span>
              <span className="text-slate-500 text-xs">
                {selectedFactory.location}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">
                Efficiency:{" "}
                <span className="text-emerald-400 font-bold">
                  {selectedFactory.efficiency}%
                </span>
              </span>
              <span className="text-slate-400">
                CO₂ Saved:{" "}
                <span className="text-emerald-400 font-bold">
                  {selectedFactory.co2Saved.toLocaleString()}t
                </span>
              </span>
              <button
                onClick={() => setSelectedFactory(null)}
                className="text-slate-500 hover:text-white text-xs ml-2 transition-colors"
              >
                ✕ Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

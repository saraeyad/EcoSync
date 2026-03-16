import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../../hooks/useStore.ts";
import { CarbonVaultScene } from "../../../components/three/CarbonVault.tsx";
import { Atom } from "lucide-react";

function DensityLabel({ density }: { density: number }) {
  const label = density > 60 ? "Critical" : density > 35 ? "Elevated" : "Clean";
  const color =
    density > 60
      ? "text-red-400"
      : density > 35
        ? "text-amber-400"
        : "text-emerald-400";
  const bgColor =
    density > 60
      ? "bg-red-500/15 border-red-500/25"
      : density > 35
        ? "bg-amber-500/15 border-amber-500/25"
        : "bg-emerald-500/15 border-emerald-500/25";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${bgColor} ${color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {label}
    </span>
  );
}

export function CarbonVaultCard() {
  const { selectedFactory } = useAppStore();
  const density = selectedFactory?.carbonDensity ?? 28;
  const name = selectedFactory?.name ?? "Global Average";

  const vaultColor =
    density > 60 ? "#ef4444" : density > 35 ? "#f59e0b" : "#10b981";

  return (
    <div className="bento-card flex flex-col h-full min-h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Atom size={18} className="text-emerald-400" />
          <h3 className="text-white font-bold text-base">Carbon Vault</h3>
        </div>
        <DensityLabel density={density} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={name}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-slate-500 mb-3"
        >
          {name}
        </motion.p>
      </AnimatePresence>

      {/* 3D Canvas — keep mounted, pass density as prop so it never unmounts */}
      <div className="flex-1 relative min-h-[220px] rounded-xl overflow-hidden -mx-2">
        {/* Glow backdrop matching vault color */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-0 transition-colors duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${vaultColor}0d, transparent 70%)`,
          }}
        />

        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
          style={{
            background: "transparent",
            width: "100%",
            height: "100%",
            minHeight: 220,
          }}
          className="relative z-10"
        >
          <CarbonVaultScene carbonDensity={density} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
          />
        </Canvas>
      </div>

      {/* Stats row */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-3 gap-3">
        {[
          { label: "Density", value: `${density}%`, color: vaultColor },
          {
            label: "Particles",
            value: `${Math.floor(density * 1.8)}`,
            color: "#94a3b8",
          },
          {
            label: "State",
            value:
              density > 60 ? "Critical" : density > 35 ? "Elevated" : "Clean",
            color: vaultColor,
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <motion.p
              key={value}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-lg font-black tabular-nums"
              style={{ color }}
            >
              {value}
            </motion.p>
            <p className="text-xs text-slate-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-600 text-center mt-2">
        Drag to rotate · Particles = carbon density
      </p>
    </div>
  );
}

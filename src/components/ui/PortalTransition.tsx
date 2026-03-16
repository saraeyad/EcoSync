import { useRef, useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { ParticleSphere } from "../three/ParticleSphere.tsx";

interface PortalButtonProps {
  label: string;
  to: string;
  className?: string;
}

export function PortalButton({ label, to, className = "" }: PortalButtonProps) {
  const [phase, setPhase]   = useState<"idle" | "charging" | "zoom" | "done">("idle");
  const navigate            = useNavigate();
  const mousePos            = useRef({ x: 0, y: 0 });

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("charging");
    setTimeout(() => setPhase("zoom"),    400);
    setTimeout(() => { setPhase("done"); navigate(to); }, 1200);
  }, [phase, navigate, to]);

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={phase !== "idle"}
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl font-black text-slate-900 transition-all ${className}`}
        whileHover={{ scale: 1.04, y: -3 }}
        whileTap={{ scale: 0.97 }}
        style={{
          background: "linear-gradient(135deg, #10b981, #34d399)",
          boxShadow: phase === "charging"
            ? "0 0 60px rgba(16,185,129,0.9), 0 0 120px rgba(16,185,129,0.5)"
            : "0 0 24px rgba(16,185,129,0.4)",
        }}
      >
        {/* Button glow ring */}
        <motion.span
          className="absolute inset-0 rounded-2xl"
          animate={phase === "charging"
            ? { boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 60px rgba(16,185,129,0.8)", "0 0 120px rgba(16,185,129,0.4)"] }
            : {}
          }
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <span className="relative z-10 px-10 py-5 text-lg">{label}</span>

        {/* Ripple on charging */}
        <AnimatePresence>
          {phase === "charging" && (
            <motion.span
              key="ripple"
              className="absolute inset-0 rounded-2xl border-2 border-emerald-300"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Full-screen portal overlay */}
      <AnimatePresence>
        {(phase === "zoom" || phase === "done") && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full h-full"
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                dpr={1}
                style={{ background: "transparent", width: "100%", height: "100%" }}
              >
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={3} color="#10b981" />
                <Suspense fallback={null}>
                  <ParticleSphere mousePos={mousePos} count={3000} radius={2.4} />
                </Suspense>
              </Canvas>
            </motion.div>

            {/* Concentric portal rings */}
            {[0, 150, 300].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-emerald-400/60"
                initial={{ width: 80, height: 80, opacity: 1 }}
                animate={{ width: "200vmax", height: "200vmax", opacity: 0 }}
                transition={{ duration: 0.9, delay: delay / 1000, ease: "easeOut" }}
                style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
            ))}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute text-emerald-400 text-sm font-medium tracking-widest uppercase"
              style={{ bottom: "12%" }}
            >
              Entering Command Center…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

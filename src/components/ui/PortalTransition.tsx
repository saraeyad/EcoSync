import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PortalButtonProps {
  label: string;
  to: string;
  className?: string;
}

/** CSS-only portal transition — avoids spinning up a full Three.js canvas. */
export function PortalButton({ label, to, className = "" }: PortalButtonProps) {
  const [phase, setPhase] = useState<"idle" | "charging" | "zoom" | "done">(
    "idle"
  );
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("charging");
    setTimeout(() => setPhase("zoom"), 280);
    setTimeout(() => {
      setPhase("done");
      navigate(to);
    }, 720);
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
          boxShadow:
            phase === "charging"
              ? "0 0 60px rgba(16,185,129,0.9), 0 0 120px rgba(16,185,129,0.5)"
              : "0 0 24px rgba(16,185,129,0.4)",
        }}
      >
        <span className="relative z-10 px-10 py-5 text-lg">{label}</span>
        <AnimatePresence>
          {phase === "charging" && (
            <motion.span
              key="ripple"
              className="absolute inset-0 rounded-2xl border-2 border-emerald-300"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.45 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {(phase === "zoom" || phase === "done") && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="w-40 h-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.55), transparent 70%)",
                boxShadow: "0 0 80px rgba(16,185,129,0.45)",
              }}
              initial={{ scale: 0.2, opacity: 0.4 }}
              animate={{ scale: 8, opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

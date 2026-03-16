import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, Leaf } from "lucide-react";
import { GlobalParticleField } from "../home/components/GlobalParticleField.tsx";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <GlobalParticleField />
      <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-lg">

          {/* Glowing 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1,   filter: "blur(0px)"  }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <span
              className="text-[10rem] font-black leading-none select-none"
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #10b981 50%, #1e293b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 40px rgba(16,185,129,0.3))",
              }}
            >
              404
            </span>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Leaf size={28} className="text-emerald-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-white mb-3"
          >
            Facility Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-sm leading-relaxed mb-8"
          >
            The page you're looking for has gone offline or doesn't exist.
            <br />
            Check the URL or head back to the platform.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-slate-700/50 text-slate-300 hover:text-white hover:border-emerald-500/30 font-semibold text-sm transition-all"
            >
              <Home size={15} /> Back to Home
            </motion.button>

            <motion.button
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 transition-all"
              style={{
                background: "linear-gradient(135deg,#10b981,#34d399)",
                boxShadow: "0 0 20px rgba(16,185,129,0.3)",
              }}
            >
              <LayoutDashboard size={15} /> Open Dashboard
            </motion.button>
          </motion.div>

          {/* Decorative grid lines */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-xs text-slate-700 font-mono"
          >
            ECOSYNC · ERROR 404 · FACILITY OFFLINE
          </motion.p>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Stats",    href: "#stats"    },
  { label: "Pricing",  href: "#pricing"  },
] as const;

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
            <Leaf size={16} className="text-emerald-400" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            Eco<span className="text-emerald-400">Sync</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Sign In</a>
          <motion.a
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm transition-colors group"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            Get Started <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-slate-300 hover:text-white transition-colors font-medium py-1" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href="/login" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-500 text-slate-900 font-bold text-sm mt-2">
                Open Dashboard <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

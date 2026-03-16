import { motion } from "framer-motion";
import { Leaf, Github, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";

const links = {
  Product: [
    { label: "Features",   href: "#features" },
    { label: "Pricing",    href: "#pricing"  },
    { label: "How it works", href: "#"       },
    { label: "Changelog",  href: "#"         },
  ],
  Platform: [
    { label: "Command Center", href: "/dashboard" },
    { label: "Analytics",      href: "/dashboard" },
    { label: "Compliance",     href: "/dashboard" },
    { label: "Forecasting",    href: "/dashboard" },
  ],
  Company: [
    { label: "About",    href: "#" },
    { label: "Blog",     href: "#" },
    { label: "Careers",  href: "#" },
    { label: "Contact",  href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy",  href: "#" },
    { label: "Terms of Service",href: "#" },
    { label: "Cookie Policy",   href: "#" },
    { label: "GDPR",            href: "#" },
  ],
};

const socials = [
  { icon: Github,   href: "#", label: "GitHub"   },
  { icon: Twitter,  href: "#", label: "Twitter"  },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail,     href: "#", label: "Email"    },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-background">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Leaf size={15} className="text-emerald-400" />
              </div>
              <span className="font-black text-lg text-white">
                Eco<span className="text-emerald-400">Sync</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
              The industrial IoT & sustainability intelligence platform for companies serious about net-zero.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Stay updated
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/40 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl text-slate-900 transition-all shrink-0"
                  style={{ background: "linear-gradient(135deg,#10b981,#34d399)" }}
                >
                  <ArrowRight size={14} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {section}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-emerald-400 transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © 2026 EcoSync Technologies Ltd. All rights reserved.
          </p>

          {/* Certifications */}
          <div className="flex items-center gap-4">
            {["SOC 2", "ISO 27001", "GDPR"].map((badge) => (
              <span key={badge} className="text-[10px] font-semibold text-slate-600 px-2 py-1 rounded border border-slate-800">
                {badge}
              </span>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-1">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={label}
                className="p-2 rounded-lg text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/8 transition-all"
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

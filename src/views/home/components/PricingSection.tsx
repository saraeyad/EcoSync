import { motion } from "framer-motion";
import { Check, Zap, Building2, Globe2, ArrowRight, Star } from "lucide-react";
import { ScrollReveal } from "../../../components/ui/ScrollReveal.tsx";
import { useState } from "react";

// ── Plan definition ───────────────────────────────────────────────────────────
interface Plan {
  name:       string;
  icon:       typeof Zap;
  monthlyPrice: number | null;
  yearlyPrice:  number | null;
  description:  string;
  badge?:       string;
  highlight:    boolean;
  features:     string[];
  cta:          string;
  ctaHref:      string;
}

const plans: Plan[] = [
  {
    name:         "Starter",
    icon:         Zap,
    monthlyPrice: 0,
    yearlyPrice:  0,
    description:  "Perfect for small operations exploring sustainability monitoring for the first time.",
    highlight:    false,
    cta:          "Start Free",
    ctaHref:      "/register",
    features: [
      "Up to 5 facilities",
      "Real-time energy monitoring",
      "Basic CO₂ reporting",
      "7-day data retention",
      "Email alerts",
      "Community support",
    ],
  },
  {
    name:         "Professional",
    icon:         Building2,
    monthlyPrice: 299,
    yearlyPrice:  249,
    description:  "For growing industrial operations that need advanced analytics and compliance tools.",
    badge:        "Most Popular",
    highlight:    true,
    cta:          "Start 14-day Trial",
    ctaHref:      "/register",
    features: [
      "Up to 50 facilities",
      "Advanced Digital Twin engine",
      "Predictive analytics & ML forecasting",
      "1-year data retention",
      "ISO 14001 compliance reports",
      "Priority support (4hr SLA)",
      "Custom dashboards",
      "API access (1M req/mo)",
      "Slack & Teams integrations",
    ],
  },
  {
    name:         "Enterprise",
    icon:         Globe2,
    monthlyPrice: null,
    yearlyPrice:  null,
    description:  "Unlimited scale for global industrial networks with dedicated infrastructure and SLAs.",
    highlight:    false,
    cta:          "Contact Sales",
    ctaHref:      "/register",
    features: [
      "Unlimited facilities",
      "Dedicated data nodes per region",
      "Custom ML model training",
      "10-year data retention",
      "Full compliance suite (ISO, GRI, TCFD)",
      "24/7 dedicated support (1hr SLA)",
      "On-premise deployment option",
      "Unlimited API requests",
      "SSO & SAML",
      "Custom SLA agreement",
    ],
  },
];

// ── Pricing card ─────────────────────────────────────────────────────────────
function PricingCard({ plan, yearly, index }: { plan: Plan; yearly: boolean; index: number }) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.div
        className={`relative flex flex-col rounded-3xl p-7 h-full transition-all duration-300 ${
          plan.highlight
            ? "border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-slate-900/60"
            : "glass border border-slate-800/60 hover:border-slate-700/60"
        }`}
        whileHover={{ y: -4 }}
        style={plan.highlight ? {
          boxShadow: "0 0 60px rgba(16,185,129,0.12), inset 0 0 60px rgba(16,185,129,0.03)",
        } : undefined}
      >
        {/* Badge */}
        {plan.badge && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-900 text-xs font-black shadow-lg shadow-emerald-500/30">
              <Star size={10} fill="currentColor" /> {plan.badge}
            </span>
          </div>
        )}

        {/* Plan header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            plan.highlight
              ? "bg-emerald-500/20 border border-emerald-500/30"
              : "bg-slate-800/80 border border-slate-700/50"
          }`}>
            <plan.icon size={18} className={plan.highlight ? "text-emerald-400" : "text-slate-400"} />
          </div>
          <h3 className="text-white font-black text-lg">{plan.name}</h3>
        </div>

        {/* Price */}
        <div className="mb-4">
          {price === null ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-white">Custom</span>
            </div>
          ) : price === 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-white">Free</span>
              <span className="text-slate-500 text-sm">forever</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-500 text-lg">$</span>
              <motion.span
                key={`${plan.name}-${yearly}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-white"
              >
                {price}
              </motion.span>
              <span className="text-slate-500 text-sm">/ mo{yearly ? " (billed yearly)" : ""}</span>
            </div>
          )}
          {price !== null && price > 0 && yearly && (
            <p className="text-emerald-400 text-xs font-semibold mt-1">
              Save ${(plan.monthlyPrice! - price) * 12}/yr vs monthly
            </p>
          )}
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-6">{plan.description}</p>

        {/* CTA */}
        <motion.a
          href={plan.ctaHref}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-7 ${
            plan.highlight
              ? "text-slate-900"
              : "glass border border-slate-700/50 text-slate-300 hover:text-white hover:border-emerald-500/30"
          }`}
          style={plan.highlight ? {
            background: "linear-gradient(135deg,#10b981,#34d399)",
            boxShadow: "0 0 20px rgba(16,185,129,0.3)",
          } : undefined}
        >
          {plan.cta} <ArrowRight size={14} />
        </motion.a>

        {/* Divider */}
        <div className="h-px bg-slate-800/80 mb-5" />

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                plan.highlight ? "bg-emerald-500/20" : "bg-slate-800"
              }`}>
                <Check size={9} className={plan.highlight ? "text-emerald-400" : "text-slate-500"} />
              </div>
              <span className="text-slate-400 text-sm leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </ScrollReveal>
  );
}

// ── FAQ row ───────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes. Upgrade or downgrade at any time. When upgrading, you're charged the pro-rated difference immediately. Downgrading takes effect at the next billing cycle.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Professional includes a 14-day free trial with full feature access — no credit card required. Enterprise plans get a custom 30-day proof of concept.",
  },
  {
    q: "How are facilities counted?",
    a: "A facility is any physical site with at least one connected sensor or data source. Individual machines or sensors within a facility do not count separately.",
  },
  {
    q: "Do you offer discounts for NGOs or universities?",
    a: "Yes — non-profit organizations, academic institutions, and climate-focused startups are eligible for up to 60% off. Contact our sales team.",
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500/4 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-5">
              <Zap size={12} /> Transparent Pricing
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Scale sustainably.
              <br />
              <span className="text-gradient">Pay as you grow.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
              No hidden fees. No sensor surcharges. Just one price for unlimited
              monitoring power.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-4 p-1 rounded-xl glass border border-slate-700/50">
              <button
                onClick={() => setYearly(false)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  !yearly ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  yearly ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Annual
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                  -17%
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20 items-start">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} yearly={yearly} index={i} />
          ))}
        </div>

        {/* Enterprise trust bar */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-20 text-slate-600 text-xs font-medium">
            {[
              "SOC 2 Type II",
              "ISO 27001",
              "GDPR Compliant",
              "99.99% Uptime SLA",
              "256-bit AES Encryption",
            ].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                <Check size={11} className="text-emerald-500" /> {badge}
              </span>
            ))}
          </div>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-white text-center mb-8">
              Frequently asked questions
            </h3>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div
                  key={faq.q}
                  className="rounded-2xl glass border border-slate-800/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-white font-semibold text-sm">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-500 shrink-0 ml-4"
                    >
                      <ArrowRight size={14} />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Merged CTA ── */}
        <ScrollReveal delay={0.1}>
          <div className="mt-20 relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(135deg,#064e3b 0%,#065f46 50%,#047857 100%)" }} />
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "32px 32px",
              }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span className="text-emerald-300 text-xs font-semibold">450+ facilities running right now</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-white">
                  Ready to sync your industrial future?
                </h3>
                <p className="text-emerald-200/70 text-sm mt-1">
                  Start free — no credit card, no consultant, no lock-in.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-black text-slate-900 text-sm transition-all whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#10b981,#34d399)", boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
                >
                  Get Started Free <ArrowRight size={14} />
                </motion.a>
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm border border-white/20 hover:border-white/40 transition-all whitespace-nowrap"
                >
                  Sign In
                </motion.a>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

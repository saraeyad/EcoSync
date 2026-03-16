import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Shield,
  Globe2,
  ChevronLeft,
} from "lucide-react";
import { GlobalParticleField } from "../home/components/GlobalParticleField.tsx";

// ── Tiny input component ──────────────────────────────────────────────────────
interface InputProps {
  id: string;
  label: string;
  type?: string;
  icon: typeof Mail;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
}

function Field({
  id,
  label,
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
}: InputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
        <input
          id={id}
          type={inputType}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-9 pr-${isPassword ? "10" : "3.5"} py-3 rounded-xl bg-slate-800/60 border text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all duration-200 ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-slate-700/60 focus:border-emerald-500/60 focus:bg-slate-800"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ── Feature pills shown on the left panel ────────────────────────────────────
const perks = [
  { icon: Zap, text: "Real-time monitoring across 450+ facilities" },
  { icon: Globe2, text: "Global coverage in 62 countries" },
  { icon: Shield, text: "ISO 14001 compliant reporting" },
];

// ── Main auth page ────────────────────────────────────────────────────────────
export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@ecosync.io");
  const [password, setPassword] = useState("demo1234");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(true);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "register" && name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!/\S+@\S+\.\S+/.test(email)) e.email = "Please enter a valid email";
    if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (mode === "register" && password !== confirm)
      e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Simulate auth — always succeeds after 1.2s
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Derive display name: use typed name for register, or email prefix for login
      const displayName =
        mode === "register" && name.trim()
          ? name.trim()
          : email
              .split("@")[0]
              .replace(/[._]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

      const parts = displayName.trim().split(" ");
      const initials =
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : displayName.slice(0, 2).toUpperCase();

      setCurrentUser({ name: displayName, email, initials });
      setTimeout(() => navigate("/dashboard"), 900);
    }, 1200);
  };

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setErrors({});
    setSuccess(false);
  };

  return (
    <>
      {/* Full-page particle background */}
      <GlobalParticleField />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
          {/* ── Left: Brand panel ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col gap-8 px-4"
          >
            {/* Back to site */}
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-400 text-sm transition-colors w-fit"
            >
              <ChevronLeft size={14} /> Back to site
            </a>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Leaf size={22} className="text-emerald-400" />
              </div>
              <span className="text-2xl font-black text-white">
                Eco<span className="text-emerald-400">Sync</span>
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-black text-white leading-tight mb-3">
                The Nerve Center
                <br />
                <span className="text-shimmer">
                  of Industrial Sustainability.
                </span>
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Join 450+ facilities already monitoring their carbon footprint
                in real-time with EcoSync's global intelligence platform.
              </p>
            </div>

            {/* Perks */}
            <div className="flex flex-col gap-3">
              {perks.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-emerald-400" />
                  </div>
                  <p className="text-slate-400 text-sm">{text}</p>
                </motion.div>
              ))}
            </div>

            {/* Demo hint */}
            <div className="p-4 rounded-2xl glass border border-emerald-500/15">
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="text-emerald-400 font-semibold">
                  Demo credentials pre-filled.
                </span>{" "}
                Just click Sign In to explore the platform — no real account
                needed.
              </p>
            </div>
          </motion.div>

          {/* ── Right: Auth card ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong rounded-3xl p-8 border border-slate-800/60 shadow-2xl shadow-black/40 w-full max-w-md mx-auto"
          >
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Leaf size={16} className="text-emerald-400" />
              </div>
              <span className="font-black text-white">
                Eco<span className="text-emerald-400">Sync</span>
              </span>
              <a
                href="/"
                className="ml-auto text-slate-500 hover:text-emerald-400 text-xs flex items-center gap-1"
              >
                <ChevronLeft size={12} /> Back
              </a>
            </div>

            {/* Tab switcher */}
            <div className="flex p-1 rounded-xl bg-slate-800/60 border border-slate-700/40 mb-7">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${
                    mode === m
                      ? "bg-emerald-500 text-slate-900"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                  >
                    <Leaf size={30} className="text-emerald-400" />
                  </motion.div>
                  <p className="text-white font-bold text-lg">
                    Welcome to EcoSync
                  </p>
                  <p className="text-slate-500 text-sm">
                    Launching your Command Center…
                  </p>
                  <div className="flex gap-1 mt-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-emerald-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  {/* Heading */}
                  <div className="mb-1">
                    <h2 className="text-xl font-black text-white">
                      {mode === "login"
                        ? "Welcome back"
                        : "Create your account"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {mode === "login"
                        ? "Sign in to your EcoSync dashboard"
                        : "Start monitoring your facilities today"}
                    </p>
                  </div>

                  {/* Name (register only) */}
                  {mode === "register" && (
                    <Field
                      id="name"
                      label="Full Name"
                      icon={User}
                      placeholder="Jane Doe"
                      value={name}
                      onChange={setName}
                      error={errors.name}
                      autoComplete="name"
                    />
                  )}

                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    icon={Mail}
                    placeholder="jane@company.com"
                    value={email}
                    onChange={setEmail}
                    error={errors.email}
                    autoComplete="email"
                  />

                  <Field
                    id="password"
                    label="Password"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    error={errors.password}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                  />

                  {mode === "register" && (
                    <Field
                      id="confirm"
                      label="Confirm Password"
                      type="password"
                      icon={Lock}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={setConfirm}
                      error={errors.confirm}
                      autoComplete="new-password"
                    />
                  )}

                  {/* Remember / forgot */}
                  {mode === "login" && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="w-3.5 h-3.5 accent-emerald-500"
                        />
                        <span className="text-xs text-slate-500">
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-1 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-slate-900 text-sm transition-all relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg,#10b981,#34d399)",
                      boxShadow: "0 0 24px rgba(16,185,129,0.35)",
                    }}
                  >
                    {loading ? (
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <>
                        {mode === "login" ? "Sign In" : "Create Account"}
                        <ArrowRight size={15} />
                      </>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span className="text-xs text-slate-600">
                      or continue with
                    </span>
                    <div className="flex-1 h-px bg-slate-800" />
                  </div>

                  {/* Social buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {["Google", "GitHub"].map((p) => (
                      <motion.button
                        key={p}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSubmit}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 text-xs font-semibold transition-all"
                      >
                        {p === "Google" ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        )}
                        {p}
                      </motion.button>
                    ))}
                  </div>

                  {/* Mode switch */}
                  <p className="text-center text-xs text-slate-600 mt-1">
                    {mode === "login"
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() =>
                        switchMode(mode === "login" ? "register" : "login")
                      }
                      className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                      {mode === "login" ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}

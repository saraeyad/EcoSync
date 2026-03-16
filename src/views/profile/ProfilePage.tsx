import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Mail,
  Phone,
  Building2,
  Globe2,
  Edit3,
  Camera,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.ts";
import {
  PROFILE_STATS,
  PROFILE_BADGES,
  PROFILE_ACTIVITY,
} from "../../constants/profile.ts";

// ── Editable field ────────────────────────────────────────────────────────────
function EditableField({
  label,
  value,
  type = "text",
  icon: Icon,
  forceEdit = false,
}: {
  label: string;
  value: string;
  type?: string;
  icon: typeof Mail;
  forceEdit?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [saved, setSaved] = useState(value);

  useEffect(() => {
    if (forceEdit) setEditing(true);
  }, [forceEdit]);

  const save = () => {
    setSaved(val);
    setEditing(false);
  };
  const cancel = () => {
    setVal(saved);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2 group">
        <div
          className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all border ${
            editing
              ? "bg-slate-800 border-emerald-500/40"
              : "bg-slate-800/40 border-slate-700/40"
          }`}
        >
          <Icon size={13} className="text-slate-500 shrink-0" />
          {editing ? (
            <input
              autoFocus
              type={type}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") cancel();
              }}
              className="flex-1 bg-transparent text-sm text-white outline-none"
            />
          ) : (
            <span className="flex-1 text-sm text-slate-300 truncate">
              {saved}
            </span>
          )}
        </div>

        {!editing && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setEditing(true)}
            className="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition-all"
          >
            <Edit3 size={12} />
          </motion.button>
        )}
      </div>
    </div>
  );
}

const stats = PROFILE_STATS;
const badges = PROFILE_BADGES;
const activity = PROFILE_ACTIVITY;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [avatarHover, setAvatarHover] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  const handleAvatarClick = () => {
    if (editMode) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Render at 4× display size (320px) for crisp retina quality
      const size = 320;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Center-crop the source to a square before resizing
      const min = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - min) / 2;
      const sy = (img.naturalHeight - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

      setAvatarSrc(canvas.toDataURL("image/jpeg", 0.95));
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
    e.target.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-5">
      {/* ── Hero card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl overflow-hidden glass border border-slate-800/60"
      >
        {/* Banner */}
        <div
          className="h-32 w-full relative"
          style={{
            background:
              "linear-gradient(135deg,#064e3b 0%,#065f46 40%,#059669 80%,#10b981 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Badges top-right */}
          <div className="absolute top-4 right-5 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-sm">
              Pro Plan
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900/40 border border-slate-700/50 text-slate-300 text-xs backdrop-blur-sm">
              Admin
            </span>
          </div>
        </div>

        {/* Avatar + name row */}
        <div className="px-7 pb-5">
          <div className="flex items-end justify-between -mt-10">
            {/* Avatar */}
            <div
              className={`relative shrink-0 ${editMode ? "cursor-pointer" : "cursor-default"}`}
              onMouseEnter={() => {
                if (editMode) setAvatarHover(true);
              }}
              onMouseLeave={() => setAvatarHover(false)}
              onClick={handleAvatarClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <motion.div
                animate={{ scale: editMode && avatarHover ? 1.04 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-20 h-20 rounded-2xl ring-4 ring-slate-900 overflow-hidden"
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "auto" }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl font-black text-slate-900">
                    {currentUser.initials}
                  </div>
                )}
              </motion.div>
              {editMode && (
                <motion.div
                  animate={{ opacity: avatarHover ? 1 : 0 }}
                  className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center"
                >
                  <Camera size={18} className="text-white" />
                </motion.div>
              )}
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            {/* Edit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditMode((m) => !m);
                setAvatarHover(false);
              }}
              className={`mb-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                editMode
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
                  : "glass border-slate-700/50 text-slate-300 hover:text-white hover:border-emerald-500/30"
              }`}
            >
              {!editMode && <Edit3 size={13} />}{" "}
              {editMode ? "Done Editing" : "Edit Profile"}
            </motion.button>
          </div>

          {/* Name + subtitle */}
          <div className="mt-3">
            <h1 className="text-xl font-black text-white">
              {currentUser.name}
            </h1>
          </div>
        </div>
      </motion.div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: form + activity */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="p-6 rounded-2xl glass border border-slate-800/60"
          >
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
              <Leaf size={14} className="text-emerald-400" /> Personal
              Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <EditableField
                label="Full Name"
                value={currentUser.name}
                icon={Leaf}
                forceEdit={editMode}
              />
              <EditableField
                label="Email"
                value={currentUser.email}
                icon={Mail}
                type="email"
                forceEdit={editMode}
              />
              <EditableField
                label="Phone"
                value="+1 (415) 555-0192"
                icon={Phone}
                forceEdit={editMode}
              />
              <EditableField
                label="Organization"
                value="EcoSync Global Ltd."
                icon={Building2}
                forceEdit={editMode}
              />
              <EditableField
                label="Region"
                value="North America"
                icon={Globe2}
                forceEdit={editMode}
              />
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="p-6 rounded-2xl glass border border-slate-800/60"
          >
            <h2 className="text-sm font-bold text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <motion.div
                  key={a.action}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: a.dot, boxShadow: `0 0 6px ${a.dot}` }}
                  />
                  <span className="flex-1 text-sm text-slate-400">
                    {a.action}
                  </span>
                  <span className="text-xs text-slate-600 whitespace-nowrap">
                    {a.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: stats + badges + account */}
        <div className="space-y-5">
          {/* Impact */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl glass border border-slate-800/60 space-y-3"
          >
            <h2 className="text-sm font-bold text-white">Your Impact</h2>
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}30`,
                  }}
                >
                  <s.icon size={14} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 leading-none">
                    {s.label}
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="p-5 rounded-2xl glass border border-slate-800/60 space-y-3"
          >
            <h2 className="text-sm font-bold text-white">Badges</h2>
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${b.color}18`,
                    border: `1px solid ${b.color}30`,
                  }}
                >
                  <b.icon size={14} style={{ color: b.color }} />
                </div>
                <p className="text-sm text-slate-300">{b.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Account info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl glass border border-slate-800/60 space-y-2.5"
          >
            <h2 className="text-sm font-bold text-white mb-1">Account</h2>
            {[
              { label: "Plan", value: "Professional", highlight: true },
              { label: "Member since", value: "Jan 2024", highlight: false },
              { label: "2FA", value: "Enabled", highlight: true },
              { label: "Last login", value: "Today, 09:41", highlight: false },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between"
              >
                <span className="text-xs text-slate-500">{row.label}</span>
                <span
                  className={`text-xs font-semibold ${row.highlight ? "text-emerald-400" : "text-slate-300"}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import type { FactoryStatus } from "../types/index.ts";

// ─── Emerald palette (primary brand colour) ──────────────────────────────────
export const emerald = {
  50:  "#ecfdf5",
  100: "#d1fae5",
  200: "#a7f3d0",
  300: "#6ee7b7",
  400: "#34d399",
  500: "#10b981",
  600: "#059669",
  700: "#047857",
  800: "#065f46",
  900: "#064e3b",
} as const;

// ─── Chart colour sequence (8 shades of emerald + teal) ─────────────────────
export const CHART_COLORS: string[] = [
  "#10b981", "#34d399", "#6ee7b7", "#059669",
  "#a7f3d0", "#047857", "#0d9488", "#14b8a6",
];

// ─── Factory / map status colours ────────────────────────────────────────────
export const STATUS_COLORS: Record<FactoryStatus, string> = {
  online:  "#10b981",
  warning: "#f59e0b",
  offline: "#ef4444",
};

export const STATUS_LABELS: Record<FactoryStatus, string> = {
  online:  "Online",
  warning: "Warning",
  offline: "Offline",
};

// ─── Semantic colours ────────────────────────────────────────────────────────
export const semanticColors = {
  success: "#10b981",
  warning: "#f59e0b",
  danger:  "#ef4444",
  info:    "#6366f1",
} as const;

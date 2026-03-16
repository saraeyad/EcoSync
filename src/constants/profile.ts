import { Factory, Zap, TrendingDown, Globe2, Shield, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProfileStat {
  icon:  LucideIcon;
  label: string;
  value: string;
  color: string;
}

export interface ProfileBadge {
  icon:  LucideIcon;
  label: string;
  color: string;
}

export interface ActivityEntry {
  action: string;
  time:   string;
  dot:    string;
}

export const PROFILE_STATS: ProfileStat[] = [
  { icon: Factory,      label: "Facilities Managed", value: "12",      color: "#10b981" },
  { icon: Zap,          label: "Energy Monitored",   value: "84.2 GW", color: "#34d399" },
  { icon: TrendingDown, label: "CO₂ Offset",         value: "3,421 t", color: "#6ee7b7" },
  { icon: Globe2,       label: "Countries Active",   value: "7",       color: "#a7f3d0" },
];

export const PROFILE_BADGES: ProfileBadge[] = [
  { icon: Shield, label: "ISO 14001 Certified",   color: "#10b981" },
  { icon: Award,  label: "Top Performer Q1 2026", color: "#f59e0b" },
  { icon: Zap,    label: "Energy Optimizer",       color: "#6366f1" },
];

export const PROFILE_ACTIVITY: ActivityEntry[] = [
  { action: "Exported compliance report",   time: "2 hours ago", dot: "#10b981" },
  { action: "Added factory: Berlin Plant",  time: "Yesterday",   dot: "#34d399" },
  { action: "Triggered alert threshold",    time: "2 days ago",  dot: "#ef4444" },
  { action: "Updated energy targets",       time: "4 days ago",  dot: "#f59e0b" },
  { action: "Connected Siemens MindSphere", time: "1 week ago",  dot: "#6366f1" },
];

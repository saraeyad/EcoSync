import {
  LayoutDashboard, Factory, BarChart3, Globe2,
  Bell, Settings, Zap, ShieldCheck, TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id:     string;
  icon:   LucideIcon;
  label:  string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard",  icon: LayoutDashboard, label: "Command Center" },
  { id: "factories",  icon: Factory,         label: "Factories"      },
  { id: "analytics",  icon: BarChart3,       label: "Analytics"      },
  { id: "global",     icon: Globe2,          label: "Global Map"     },
  { id: "energy",     icon: Zap,             label: "Energy Flow"    },
  { id: "compliance", icon: ShieldCheck,     label: "Compliance"     },
  { id: "trends",     icon: TrendingUp,      label: "Forecasting"    },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: "alerts",   icon: Bell,     label: "Alerts",   badge: 3 },
  { id: "settings", icon: Settings, label: "Settings"            },
];

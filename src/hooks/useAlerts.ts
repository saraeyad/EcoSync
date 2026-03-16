import { useAppStore } from "./store.ts";
import type { AlertType } from "./store.ts";

export type { AlertType };

export function useAlerts() {
  return useAppStore((s) => ({
    alerts: s.alerts,
    dismissAlert: s.dismissAlert,
    loadAlerts: s.loadAlerts,
  }));
}

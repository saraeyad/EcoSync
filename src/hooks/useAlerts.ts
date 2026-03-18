import { useAppStore } from "./store.ts";
import type { AlertType } from "./store.ts";

export type { AlertType };

export function useAlerts() {
  const alerts = useAppStore((s) => s.alerts);
  const dismissAlert = useAppStore((s) => s.dismissAlert);
  const loadAlerts = useAppStore((s) => s.loadAlerts);
  return { alerts, dismissAlert, loadAlerts };
}

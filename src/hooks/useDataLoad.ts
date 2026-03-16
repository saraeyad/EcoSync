import { useAppStore } from "./store.ts";

export function useDataLoad() {
  return useAppStore((s) => ({
    loadFactories: s.loadFactories,
    loadAlerts: s.loadAlerts,
    loadCompliance: s.loadCompliance,
    supabaseError: s.supabaseError,
    clearSupabaseError: s.clearSupabaseError,
    factoriesLoaded: s.factoriesLoaded,
    alertsLoaded: s.alertsLoaded,
    complianceLoaded: s.complianceLoaded,
  }));
}

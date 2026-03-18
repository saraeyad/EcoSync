import { useAppStore } from "./store.ts";

export function useDataLoad() {
  const loadFactories = useAppStore((s) => s.loadFactories);
  const loadAlerts = useAppStore((s) => s.loadAlerts);
  const loadCompliance = useAppStore((s) => s.loadCompliance);
  const supabaseError = useAppStore((s) => s.supabaseError);
  const clearSupabaseError = useAppStore((s) => s.clearSupabaseError);
  const factoriesLoaded = useAppStore((s) => s.factoriesLoaded);
  const alertsLoaded = useAppStore((s) => s.alertsLoaded);
  const complianceLoaded = useAppStore((s) => s.complianceLoaded);
  return {
    loadFactories,
    loadAlerts,
    loadCompliance,
    supabaseError,
    clearSupabaseError,
    factoriesLoaded,
    alertsLoaded,
    complianceLoaded,
  };
}

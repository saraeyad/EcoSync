import { useAppStore } from "./store.ts";

export function useCompliance() {
  return useAppStore((s) => ({
    complianceStandards: s.complianceStandards,
    loadCompliance: s.loadCompliance,
  }));
}

import { useAppStore } from "./store.ts";

export function useCompliance() {
  const complianceStandards = useAppStore((s) => s.complianceStandards);
  const loadCompliance = useAppStore((s) => s.loadCompliance);
  return { complianceStandards, loadCompliance };
}

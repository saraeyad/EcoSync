import {
  DEMO_COMPLIANCE,
  isNetworkFetchError,
} from "../constants/demoData.ts";
import { supabase } from "../lib/supabase.ts";
import {
  mapComplianceRow,
  type ComplianceStandardRow,
} from "../lib/supabase-mappers.ts";

type SetState = (partial: object | ((s: object) => object)) => void;

export function createLoadCompliance(set: SetState) {
  return async function loadCompliance() {
    if (!supabase) {
      set({
        complianceStandards: DEMO_COMPLIANCE,
        complianceLoaded: true,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("compliance_standards")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.warn("[EcoSync] loadCompliance failed:", error.message);
        if (isNetworkFetchError(error.message)) {
          set({
            complianceStandards: DEMO_COMPLIANCE,
            complianceLoaded: true,
          });
          return;
        }
        set((s: { supabaseError: string | null }) => ({
          complianceLoaded: true,
          supabaseError: s.supabaseError || `Compliance: ${error.message}`,
        }));
        return;
      }

      if (data && data.length > 0) {
        set({
          complianceStandards: (data as ComplianceStandardRow[]).map(
            mapComplianceRow
          ),
          complianceLoaded: true,
        });
      } else {
        set({ complianceStandards: [], complianceLoaded: true });
      }
    } catch (err) {
      console.warn("[EcoSync] loadCompliance threw:", err);
      set({
        complianceStandards: DEMO_COMPLIANCE,
        complianceLoaded: true,
      });
    }
  };
}

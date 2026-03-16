import { supabase } from "../lib/supabase.ts";
import { mapAlertRow, type AlertRow } from "../lib/supabase-mappers.ts";

type SetState = (partial: object | ((s: object) => object)) => void;

export function createLoadAlerts(set: SetState) {
  return async function loadAlerts() {
    if (!supabase) {
      set({ alertsLoaded: true });
      return;
    }
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[EcoSync] loadAlerts failed:", error.message);
      set((s: { supabaseError: string | null }) => ({
        alertsLoaded: true,
        supabaseError: s.supabaseError || `Alerts: ${error.message}`,
      }));
      return;
    }
    if (data && data.length > 0) {
      set({
        alerts: (data as AlertRow[]).map(mapAlertRow),
        alertsLoaded: true,
      });
    } else {
      set({ alerts: [], alertsLoaded: true });
    }
  };
}

export function createDismissAlert(set: SetState) {
  return function dismissAlert(id: number) {
    if (supabase) {
      supabase.from("alerts").delete().eq("id", id).then(({ error }) => {
        if (error) console.warn("[EcoSync] dismissAlert failed:", error.message);
      });
    }
    set((s: { alerts: { id: number }[] }) => ({
      alerts: s.alerts.filter((a) => a.id !== id),
    }));
  };
}

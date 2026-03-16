import type { Factory } from "../types/index.ts";
import { generateEnergyData } from "../constants/energy.ts";
import { supabase, hasSupabase } from "../lib/supabase.ts";
import {
  mapFactoryRow,
  buildStreamsFromFactories,
  factoryToInsertRow,
  type FactoryRow,
} from "../lib/supabase-mappers.ts";

type SetState = (partial: object | ((s: object) => object)) => void;
type GetState = () => object;

export function createLoadFactories(set: SetState) {
  return async function loadFactories() {
    if (!supabase) {
      set({
        factoriesLoaded: true,
        supabaseError: hasSupabase
          ? null
          : "Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server.",
      });
      return;
    }
    set({ supabaseError: null });
    const { data, error } = await supabase
      .from("factories")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.warn("[EcoSync] loadFactories failed:", error.message);
      let msg = `Factories: ${error.message}`;
      if (
        error.message.includes("Invalid API key") ||
        (error.message.toLowerCase().includes("invalid") &&
          error.message.toLowerCase().includes("key"))
      ) {
        msg +=
          " — Use the legacy anon key (long JWT starting with eyJ...), not the Publishable key. In Supabase: Project Settings → API → open 'Legacy anon, service_role API keys' and copy the anon public key.";
      } else if (
        error.message.includes("RLS") ||
        error.message.includes("policy")
      ) {
        msg += " — Check Row Level Security (RLS) policies for the factories table.";
      }
      set({ factoriesLoaded: true, supabaseError: msg });
      return;
    }
    if (data && data.length > 0) {
      const factories = (data as FactoryRow[]).map(mapFactoryRow);
      if (import.meta.env.DEV)
        console.log("[EcoSync] Loaded", factories.length, "factories");
      set({
        factories,
        factoryStreams: buildStreamsFromFactories(factories),
        factoriesLoaded: true,
      });
    } else {
      if (import.meta.env.DEV)
        console.log(
          "[EcoSync] factories: 0 rows (empty table or RLS blocking)"
        );
      set({ factories: [], factoryStreams: {}, factoriesLoaded: true });
    }
  };
}

export function createAddFactory(set: SetState, get: GetState) {
  return async function addFactory(factory: Factory) {
    if (supabase) {
      const payload = factoryToInsertRow(factory);
      const { data, error } = await supabase
        .from("factories")
        .insert(payload)
        .select()
        .single();
      if (error) {
        console.warn("[EcoSync] addFactory failed:", error.message);
        return;
      }
      const inserted = mapFactoryRow(data as FactoryRow);
      const state = get() as { factoryStreams: Record<number, unknown[]>; factories: Factory[] };
      set({
        factories: [...state.factories, inserted],
        factoryStreams: {
          ...state.factoryStreams,
          [inserted.id]: generateEnergyData(20, inserted.energySeed),
        },
      });
    } else {
      const state = get() as { factoryStreams: Record<number, unknown[]>; factories: Factory[] };
      set({
        factories: [...state.factories, factory],
        factoryStreams: {
          ...state.factoryStreams,
          [factory.id]: generateEnergyData(20, factory.energySeed),
        },
      });
    }
  };
}

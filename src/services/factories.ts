import type { Factory } from "../types/index.ts";
import { generateEnergyData } from "../constants/energy.ts";
import {
  DEMO_FACTORIES,
  isNetworkFetchError,
} from "../constants/demoData.ts";
import { supabase } from "../lib/supabase.ts";
import {
  mapFactoryRow,
  buildStreamsFromFactories,
  factoryToInsertRow,
  type FactoryRow,
} from "../lib/supabase-mappers.ts";

type SetState = (partial: object | ((s: object) => object)) => void;
type GetState = () => object;

/** Use demo factories quietly — no banner spam when backend is down. */
function applyDemoFactories(set: SetState) {
  if (import.meta.env.DEV) {
    console.info("[EcoSync] Using demo factory data (Supabase unavailable or unset).");
  }
  set({
    factories: DEMO_FACTORIES,
    factoryStreams: buildStreamsFromFactories(DEMO_FACTORIES),
    factoriesLoaded: true,
    supabaseError: null,
  });
}

export function createLoadFactories(set: SetState) {
  return async function loadFactories() {
    if (!supabase) {
      applyDemoFactories(set);
      return;
    }

    set({ supabaseError: null });

    try {
      const { data, error } = await supabase
        .from("factories")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.warn("[EcoSync] loadFactories failed:", error.message);
        if (isNetworkFetchError(error.message)) {
          applyDemoFactories(set);
          return;
        }
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
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn("[EcoSync] loadFactories threw:", message);
      applyDemoFactories(set);
    }
  };
}

export function createAddFactory(set: SetState, get: GetState) {
  return async function addFactory(factory: Factory) {
    if (supabase) {
      const payload = factoryToInsertRow(factory);
      try {
        const { data, error } = await supabase
          .from("factories")
          .insert(payload)
          .select()
          .single();
        if (error) {
          console.warn("[EcoSync] addFactory failed:", error.message);
          // Still keep it locally so the UI stays usable offline
        } else if (data) {
          const inserted = mapFactoryRow(data as FactoryRow);
          const state = get() as {
            factoryStreams: Record<number, unknown[]>;
            factories: Factory[];
          };
          set({
            factories: [...state.factories, inserted],
            factoryStreams: {
              ...state.factoryStreams,
              [inserted.id]: generateEnergyData(20, inserted.energySeed),
            },
          });
          return;
        }
      } catch (err) {
        console.warn("[EcoSync] addFactory threw:", err);
      }
    }

    const state = get() as {
      factoryStreams: Record<number, unknown[]>;
      factories: Factory[];
    };
    set({
      factories: [...state.factories, factory],
      factoryStreams: {
        ...state.factoryStreams,
        [factory.id]: generateEnergyData(20, factory.energySeed),
      },
    });
  };
}

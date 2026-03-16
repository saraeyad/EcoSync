import { create } from "zustand";
import type { Factory, EnergyDataPoint, CurrentUser, Alert } from "../types/index.ts";
import { generateEnergyData } from "../constants/energy.ts";
import { createLoadFactories, createAddFactory } from "../services/factories.ts";
import { createLoadAlerts, createDismissAlert } from "../services/alerts.ts";
import { createLoadCompliance } from "../services/compliance.ts";
import type { ComplianceStandard } from "../lib/supabase-mappers.ts";

export type { AlertType, CurrentUser, Alert } from "../types/index.ts";
export type { ComplianceStandard } from "../lib/supabase-mappers.ts";

type FactoryStreams = Record<number, EnergyDataPoint[]>;

export interface AppState {
  sidebarCollapsed:  boolean;
  sidebarMobileOpen: boolean;
  activeNav:         string;
  currentUser:       CurrentUser;
  factories:         Factory[];
  selectedFactory:   Factory | null;
  factoryStreams:    FactoryStreams;
  globalEnergyData:  EnergyDataPoint[];
  alerts:            Alert[];
  complianceStandards: ComplianceStandard[];
  factoriesLoaded:   boolean;
  alertsLoaded:      boolean;
  complianceLoaded:  boolean;
  supabaseError:     string | null;
  setCurrentUser:    (user: CurrentUser) => void;
  toggleSidebar:     () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  setActiveNav:      (nav: string) => void;
  setSelectedFactory: (factory: Factory | null) => void;
  pushGlobalPoint:   () => void;
  pushFactoryPoint:  (factoryId: number) => void;
  addFactory:        (factory: Factory) => Promise<void>;
  dismissAlert:      (id: number) => void;
  loadFactories:     () => Promise<void>;
  loadAlerts:        () => Promise<void>;
  loadCompliance:    () => Promise<void>;
  clearSupabaseError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  sidebarCollapsed:  false,
  sidebarMobileOpen: false,
  activeNav:         "dashboard",
  currentUser:       { name: "Demo User", email: "demo@ecosync.io", initials: "DU" },
  factories:         [],
  selectedFactory:   null,
  factoryStreams:    {},
  globalEnergyData:  generateEnergyData(20),
  alerts:            [],
  complianceStandards: [],
  factoriesLoaded:   false,
  alertsLoaded:      false,
  complianceLoaded:  false,
  supabaseError:     null,

  setCurrentUser:    (user) => set({ currentUser: user }),
  toggleSidebar:     () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobileSidebar: () => set((s) => ({ sidebarMobileOpen: !s.sidebarMobileOpen })),
  closeMobileSidebar: () => set({ sidebarMobileOpen: false }),
  setActiveNav:      (nav) => set({ activeNav: nav }),
  setSelectedFactory: (factory) => set({ selectedFactory: factory }),

  loadFactories:     createLoadFactories(set),
  loadAlerts:        createLoadAlerts(set),
  loadCompliance:    createLoadCompliance(set),
  addFactory:        createAddFactory(set, get),
  dismissAlert:      createDismissAlert(set),

  pushGlobalPoint: () => {
    const data = get().globalEnergyData;
    const n    = data.length;
    set({
      globalEnergyData: [
        ...data.slice(-19),
        {
          time:       `${n * 2}s`,
          energy:     Math.floor(Math.random() * 40) + 60,
          carbon:     Math.floor(Math.random() * 30) + 40,
          efficiency: Math.floor(Math.random() * 20) + 75,
        },
      ],
    });
  },

  pushFactoryPoint: (factoryId) => {
    const streams = get().factoryStreams;
    const data    = streams[factoryId] ?? [];
    const factory = get().factories.find((f) => f.id === factoryId);
    const base    = factory ? factory.efficiency : 75;
    const n       = data.length;
    set({
      factoryStreams: {
        ...streams,
        [factoryId]: [
          ...data.slice(-19),
          {
            time:       `${n * 2}s`,
            energy:     Math.max(10, Math.min(100, base + (Math.random() - 0.5) * 20)),
            carbon:     Math.max(10, Math.min(100, (100 - base) + (Math.random() - 0.5) * 15)),
            efficiency: Math.max(10, Math.min(100, base + (Math.random() - 0.5) * 10)),
          },
        ],
      },
    });
  },

  clearSupabaseError: () => set({ supabaseError: null }),
}));

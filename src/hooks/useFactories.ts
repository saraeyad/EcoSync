import { useAppStore } from "./store.ts";

export function useFactories() {
  return useAppStore((s) => ({
    factories: s.factories,
    selectedFactory: s.selectedFactory,
    setSelectedFactory: s.setSelectedFactory,
    factoryStreams: s.factoryStreams,
    addFactory: s.addFactory,
    loadFactories: s.loadFactories,
  }));
}

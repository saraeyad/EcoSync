import { useAppStore } from "./store.ts";

export function useFactories() {
  const factories = useAppStore((s) => s.factories);
  const selectedFactory = useAppStore((s) => s.selectedFactory);
  const setSelectedFactory = useAppStore((s) => s.setSelectedFactory);
  const factoryStreams = useAppStore((s) => s.factoryStreams);
  const addFactory = useAppStore((s) => s.addFactory);
  const loadFactories = useAppStore((s) => s.loadFactories);
  return {
    factories,
    selectedFactory,
    setSelectedFactory,
    factoryStreams,
    addFactory,
    loadFactories,
  };
}

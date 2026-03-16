import { useAppStore } from "./store.ts";

export function useEnergyData() {
  return useAppStore((s) => ({
    globalEnergyData: s.globalEnergyData,
    factoryStreams: s.factoryStreams,
    pushGlobalPoint: s.pushGlobalPoint,
    pushFactoryPoint: s.pushFactoryPoint,
  }));
}

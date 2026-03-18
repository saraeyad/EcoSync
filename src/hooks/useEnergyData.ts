import { useAppStore } from "./store.ts";

export function useEnergyData() {
  const globalEnergyData = useAppStore((s) => s.globalEnergyData);
  const factoryStreams = useAppStore((s) => s.factoryStreams);
  const pushGlobalPoint = useAppStore((s) => s.pushGlobalPoint);
  const pushFactoryPoint = useAppStore((s) => s.pushFactoryPoint);
  return { globalEnergyData, factoryStreams, pushGlobalPoint, pushFactoryPoint };
}

import type { EnergyDataPoint } from "../types/index.ts";

export function generateEnergyData(points = 20, seed = 1): EnergyDataPoint[] {
  let s = seed;
  const rng = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  return Array.from({ length: points }, (_, i) => ({
    time:       `${i * 2}s`,
    energy:     Math.floor(rng() * 40) + 60,
    carbon:     Math.floor(rng() * 30) + 40,
    efficiency: Math.floor(rng() * 20) + 75,
  }));
}

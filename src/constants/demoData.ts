import type { Factory, Alert } from "../types/index.ts";
import type { ComplianceStandard } from "../lib/supabase-mappers.ts";

/** Offline / demo seed used when Supabase is unreachable or not configured. */
export const DEMO_FACTORIES: Factory[] = [
  {
    id: 1,
    name: "Nile Delta Plant",
    location: "Cairo",
    country: "Egypt",
    status: "online",
    efficiency: 88,
    carbonCredit: 1240,
    carbonDensity: 32,
    output: "2.4 GW",
    coordinates: [31.2357, 30.0444],
    energySeed: 11,
    co2Saved: 412,
    temperature: 27,
    uptime: 99.2,
  },
  {
    id: 2,
    name: "Rhine Energy Hub",
    location: "Cologne",
    country: "Germany",
    status: "online",
    efficiency: 91,
    carbonCredit: 980,
    carbonDensity: 24,
    output: "1.8 GW",
    coordinates: [6.9603, 50.9375],
    energySeed: 22,
    co2Saved: 356,
    temperature: 18,
    uptime: 99.6,
  },
  {
    id: 3,
    name: "Bay Area Microgrid",
    location: "Oakland",
    country: "USA",
    status: "warning",
    efficiency: 76,
    carbonCredit: 640,
    carbonDensity: 48,
    output: "0.9 GW",
    coordinates: [-122.2712, 37.8044],
    energySeed: 33,
    co2Saved: 210,
    temperature: 21,
    uptime: 97.4,
  },
  {
    id: 4,
    name: "Singapore Harbor Site",
    location: "Singapore",
    country: "Singapore",
    status: "online",
    efficiency: 94,
    carbonCredit: 1520,
    carbonDensity: 18,
    output: "3.1 GW",
    coordinates: [103.8198, 1.3521],
    energySeed: 44,
    co2Saved: 501,
    temperature: 30,
    uptime: 99.8,
  },
  {
    id: 5,
    name: "São Paulo Works",
    location: "São Paulo",
    country: "Brazil",
    status: "offline",
    efficiency: 0,
    carbonCredit: 120,
    carbonDensity: 72,
    output: "0 GW",
    coordinates: [-46.6333, -23.5505],
    energySeed: 55,
    co2Saved: 40,
    temperature: 26,
    uptime: 82.1,
  },
  {
    id: 6,
    name: "Tokyo East Facility",
    location: "Tokyo",
    country: "Japan",
    status: "online",
    efficiency: 89,
    carbonCredit: 1105,
    carbonDensity: 28,
    output: "2.1 GW",
    coordinates: [139.6917, 35.6895],
    energySeed: 66,
    co2Saved: 388,
    temperature: 22,
    uptime: 99.1,
  },
];

export const DEMO_ALERTS: Alert[] = [
  {
    id: 1,
    type: "warning",
    message: "Bay Area Microgrid efficiency dropped below 80%",
    time: "12m ago",
  },
  {
    id: 2,
    type: "info",
    message: "São Paulo Works went offline — maintenance window",
    time: "1h ago",
  },
  {
    id: 3,
    type: "success",
    message: "Singapore Harbor Site hit monthly CO₂ target",
    time: "3h ago",
  },
];

export const DEMO_COMPLIANCE: ComplianceStandard[] = [
  {
    id: "iso14001",
    label: "ISO 14001",
    desc: "Environmental management systems",
    pass: 5,
    total: 6,
  },
  {
    id: "ghg",
    label: "GHG Protocol",
    desc: "Scope 1–3 emissions reporting",
    pass: 4,
    total: 6,
  },
  {
    id: "cdp",
    label: "CDP Climate",
    desc: "Climate disclosure score readiness",
    pass: 3,
    total: 6,
  },
];

export function isNetworkFetchError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("failed to fetch") ||
    m.includes("networkerror") ||
    m.includes("load failed") ||
    m.includes("network request failed")
  );
}

export function supabaseUnreachableMessage(scope: string): string {
  return (
    `${scope}: cannot reach Supabase (Failed to fetch). ` +
    `The project URL may be paused/deleted, or Vercel env vars are wrong. ` +
    `Showing demo data. Fix: restore the project in Supabase → update ` +
    `VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY on Vercel → redeploy.`
  );
}

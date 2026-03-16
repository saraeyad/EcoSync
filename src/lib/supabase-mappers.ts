import type { Factory, FactoryStatus, Alert, AlertType, EnergyDataPoint } from "../types/index.ts";
import { generateEnergyData } from "../constants/energy.ts";

// DB row shapes (snake_case from Supabase)
export interface FactoryRow {
  id: number;
  name: string;
  location: string;
  country: string;
  status: string;
  efficiency: number;
  carbon_credit: number;
  carbon_density: number;
  output: string;
  longitude: number;
  latitude: number;
  energy_seed: number;
  co2_saved: number;
  temperature: number;
  uptime: number;
}

export interface AlertRow {
  id: number;
  factory_id: number | null;
  type: string;
  message: string;
  created_at: string;
}

export interface ComplianceStandardRow {
  id: string;
  label: string;
  description: string;
  pass_count: number;
  total_count: number;
}

export interface ComplianceStandard {
  id: string;
  label: string;
  desc: string;
  pass: number;
  total: number;
}

export function mapComplianceRow(row: ComplianceStandardRow): ComplianceStandard {
  return {
    id: row.id,
    label: row.label,
    desc: row.description,
    pass: row.pass_count,
    total: row.total_count,
  };
}

export function mapFactoryRow(row: FactoryRow): Factory {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    country: row.country,
    status: row.status as FactoryStatus,
    efficiency: row.efficiency,
    carbonCredit: row.carbon_credit,
    carbonDensity: row.carbon_density,
    output: row.output,
    coordinates: [row.longitude, row.latitude],
    energySeed: row.energy_seed,
    co2Saved: row.co2_saved,
    temperature: row.temperature,
    uptime: row.uptime,
  };
}

/** Build insert payload for Supabase (no id, snake_case). */
export function factoryToInsertRow(factory: Factory): Omit<FactoryRow, "id"> {
  const [longitude, latitude] = factory.coordinates;
  return {
    name: factory.name,
    location: factory.location,
    country: factory.country,
    status: factory.status,
    efficiency: factory.efficiency,
    carbon_credit: factory.carbonCredit,
    carbon_density: factory.carbonDensity,
    output: factory.output,
    longitude,
    latitude,
    energy_seed: factory.energySeed,
    co2_saved: factory.co2Saved,
    temperature: factory.temperature,
    uptime: factory.uptime,
  };
}

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffM = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3600_000);
  const diffD = Math.floor(diffMs / 86400_000);
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString();
}

export function mapAlertRow(row: AlertRow): Alert {
  return {
    id: row.id,
    type: row.type as AlertType,
    message: row.message,
    time: formatTimeAgo(row.created_at),
  };
}

export type FactoryStreams = Record<number, EnergyDataPoint[]>;

export function buildStreamsFromFactories(factories: Factory[]): FactoryStreams {
  return Object.fromEntries(
    factories.map((f) => [f.id, generateEnergyData(20, f.energySeed)])
  );
}

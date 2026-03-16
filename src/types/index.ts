// ─── Factory ─────────────────────────────────────────────────────────────────

export type FactoryStatus = "online" | "offline" | "warning";

export interface Factory {
  id:            number;
  name:          string;
  location:      string;
  country:       string;
  status:        FactoryStatus;
  efficiency:    number;
  carbonCredit:  number;
  carbonDensity: number;   // 0–100: drives the 3D Vault particles
  output:        string;
  coordinates:   [number, number]; // [longitude, latitude]
  energySeed:    number;           // seed for per-factory data stream
  co2Saved:      number;           // tons saved this month
  temperature:   number;           // avg facility temp °C
  uptime:        number;           // % uptime last 30 days
}

// ─── Energy ──────────────────────────────────────────────────────────────────

export interface EnergyDataPoint {
  time:       string;
  energy:     number;
  carbon:     number;
  efficiency: number;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface CurrentUser {
  name:     string;
  email:    string;
  initials: string;
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export type AlertType = "warning" | "success" | "info";

export interface Alert {
  id:      number;
  type:    AlertType;
  message: string;
  time:    string;
}

import type { Factory, EnergyDataPoint } from "../types/index.ts";

// ─── Export helpers (data lives in Supabase) ──────────────────────────────────

export function exportToCSV(data: Factory[]): void {
  const headers = [
    "ID","Name","Location","Country","Status",
    "Efficiency %","Carbon Credit","Carbon Density",
    "Output","CO2 Saved (t)","Uptime %",
  ];
  const rows = data.map((f) =>
    [f.id, f.name, f.location, f.country, f.status,
     f.efficiency, f.carbonCredit, f.carbonDensity,
     f.output, f.co2Saved, f.uptime].join(",")
  );
  const csv  = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `ecosync-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportEnergyJSON(factoryName: string, data: EnergyDataPoint[]): void {
  const json = JSON.stringify(
    { factory: factoryName, exportedAt: new Date().toISOString(), data },
    null, 2,
  );
  const blob = new Blob([json], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${factoryName.replace(/\s+/g, "-").toLowerCase()}-energy.json`;
  a.click();
  URL.revokeObjectURL(url);
}

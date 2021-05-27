export interface MeasurementUnit {
  id: number;
  symbol: string;
  unit_name: string;
}

export function getDisplayName(mu: MeasurementUnit) {
  if (mu.symbol !== undefined && mu.symbol !== "") return mu.symbol;

  return mu.unit_name;
}

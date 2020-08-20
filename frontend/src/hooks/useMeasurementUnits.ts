import { useFetch } from "./useFetch";

import { MeasurementUnit } from "../model";

export function useMeasurementUnits() {
  return useFetch<MeasurementUnit[]>(`http://localhost:5000/measurement_units`);
}

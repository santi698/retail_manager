import { getMeasurementUnits } from "../services/MeasurementUnitsService";
import { useQuery } from "react-query";

export function useMeasurementUnits() {
  return useQuery("measurement_units", () => getMeasurementUnits());
}

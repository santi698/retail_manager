import { useQuery } from "react-query";
import { getMeasurementUnits } from "../services/MeasurementUnitsService";

export function useMeasurementUnits() {
  return useQuery("measurement_units", () => getMeasurementUnits());
}

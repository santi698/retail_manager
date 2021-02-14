import { MeasurementUnit } from "../domain/MeasurementUnit";
import { RetailManagerApi } from "../../common/services/RetailManagerApi";

export function getMeasurementUnits() {
  return RetailManagerApi.get<MeasurementUnit[]>(`/api/measurement_units`);
}

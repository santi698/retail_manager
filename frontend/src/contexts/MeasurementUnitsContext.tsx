import { makeLoadableContext } from "./LoadableContext";
import { MeasurementUnit } from "../model";
import { API_URL } from "../config";

const {
  Provider: MeasurementUnitsProvider,
  useData: useMeasurementUnits,
} = makeLoadableContext<MeasurementUnit[]>({
  fetchUrl: `${API_URL}/api/measurement_units`,
});

export { MeasurementUnitsProvider, useMeasurementUnits };

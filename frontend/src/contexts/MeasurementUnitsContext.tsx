import { makeLoadableContext } from "./LoadableContext";
import { MeasurementUnit } from "../model";

const {
  Provider: MeasurementUnitsProvider,
  useData: useMeasurementUnits,
} = makeLoadableContext<MeasurementUnit[]>({
  fetchUrl: "http://localhost:5000/measurement_units",
  refetchInterval: 60000,
});

export { MeasurementUnitsProvider, useMeasurementUnits };

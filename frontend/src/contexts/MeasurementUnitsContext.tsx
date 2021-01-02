import { makeLoadableContext } from "./LoadableContext";
import { MeasurementUnit } from "../model";

const {
  Provider: MeasurementUnitsProvider,
  useData: useMeasurementUnits,
} = makeLoadableContext<MeasurementUnit[]>({
  fetchUrl: "http://192.168.0.110:5000/api/measurement_units",
});

export { MeasurementUnitsProvider, useMeasurementUnits };

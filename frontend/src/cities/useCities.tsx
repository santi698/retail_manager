import { City } from "../domain/City";
import { useQuery } from "react-query";
import { getCities } from "./CitiesService";

export function useCities() {
  return useQuery<City[], Error>("cities", getCities);
}

import { useQuery } from "react-query";
import { City } from "../domain/City";
import { getCities } from "./CitiesService";

export function useCities() {
  return useQuery<City[], Error>("cities", getCities);
}

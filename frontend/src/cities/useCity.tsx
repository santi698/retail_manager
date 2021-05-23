import { useQuery } from "react-query";
import { City } from "../domain/City";
import { getCity } from "./CitiesService";

export function useCity(id: number) {
  return useQuery<City, Error>(["cities", { id }], () => getCity(id));
}

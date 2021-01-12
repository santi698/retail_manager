import { makeLoadableContext } from "./LoadableContext";
import { City } from "../model";
import { Loadable } from "../Loadable";
import { API_URL } from "../config";

const { Provider: CitiesProvider, useData: useCities } = makeLoadableContext<
  City[]
>({
  fetchUrl: `${API_URL}/api/cities`,
});

export { CitiesProvider, useCities };

export function useCity(id: number): Loadable<City> {
  const loadable = useCities();

  return loadable.map<City>((cities) => {
    const city = cities.find((city) => city.id === id);
    if (city === undefined) throw new Error(`City with id ${id} not found`);
    return city;
  });
}

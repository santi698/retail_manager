import { makeLoadableContext } from "./LoadableContext";
import { City } from "../model";
import { Loadable } from "../Loadable";

const { Provider: CitiesProvider, useData: useCities } = makeLoadableContext<
  City[]
>({
  fetchUrl: "http://192.168.1.104:5000/api/cities",
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

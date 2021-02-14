import { City } from "../domain/City";
import { RetailManagerApi } from "../common/services/RetailManagerApi";

export async function getCities(): Promise<City[]> {
  return RetailManagerApi.get<City[]>(`/api/cities`);
}

export async function getCity(id: number): Promise<City> {
  return RetailManagerApi.get<City>(`/api/cities/${id}`);
}

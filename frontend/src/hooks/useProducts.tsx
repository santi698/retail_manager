import { useFetch } from "./useFetch";
import { ProductWithPrice } from "../model";

export function useProducts() {
  return useFetch<ProductWithPrice[]>("http://localhost:5000/products");
}

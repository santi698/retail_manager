import { useFetch } from "./useFetch";
import { Product } from "../model";

export function useProducts() {
  return useFetch<Product[]>("http://localhost:5000/products");
}

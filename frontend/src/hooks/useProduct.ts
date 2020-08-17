import { useFetch } from "./useFetch";

import { Product } from "../model";

export function useProduct(id: number) {
  return useFetch<Product>(`http://localhost:5000/products/${id}`);
}

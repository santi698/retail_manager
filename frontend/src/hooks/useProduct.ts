import { useFetch } from "./useFetch";

import { ProductWithPrice } from "../model";

export function useProduct(id: number) {
  return useFetch<ProductWithPrice>(`http://localhost:5000/products/${id}`);
}

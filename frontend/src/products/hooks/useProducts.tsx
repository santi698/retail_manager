import { useQuery } from "react-query";
import { ProductWithPrice } from "../domain/ProductWithPrice";
import { getProducts } from "../services/ProductsService";

export function useProducts() {
  return useQuery<ProductWithPrice[]>("products", () => getProducts());
}

import { useQuery } from "react-query";
import { getProduct } from "../services/ProductsService";

export function useProduct(product_code: number) {
  return useQuery(["products", product_code], () => getProduct(product_code));
}

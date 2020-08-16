import { useFetch } from "./useFetch";
import { Product } from "../model";

function useProducts() {
  return useFetch<Product[]>("http://localhost:5000/products");
}

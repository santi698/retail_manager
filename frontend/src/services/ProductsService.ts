import { API_URL } from "../config";
import { Product, ProductWithPrice } from "../model";
import { RetailManagerApi } from "./RetailManagerApi";

export async function createProduct(
  product: Omit<ProductWithPrice, "product_code">
) {
  return RetailManagerApi.post(`${API_URL}/api/products`, product);
}

export async function editProduct(
  product_code: number,
  product: Omit<Product, "product_code">
) {
  return RetailManagerApi.put(
    `${API_URL}/api/products/${product_code}`,
    product
  );
}

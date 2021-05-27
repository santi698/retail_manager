import { ProductWithPrice } from "../domain/ProductWithPrice";
import { Product } from "../domain/Product";
import { RetailManagerApi } from "../../common/services/RetailManagerApi";

export async function getProduct(product_code: number) {
  return RetailManagerApi.get<ProductWithPrice>(
    `/api/products/${product_code}`
  );
}

export async function getProducts() {
  return RetailManagerApi.get<ProductWithPrice[]>(`/api/products`);
}

export async function createProduct(
  product: Omit<ProductWithPrice, "product_code">
) {
  return RetailManagerApi.post(`/api/products`, product);
}

export async function editProduct(
  product_code: number,
  product: Pick<Product, "product_name">
) {
  return RetailManagerApi.put(`/api/products/${product_code}`, product);
}

export interface ProductPrice {
  product_code: number;
  valid_since: string;
  price: number;
}

export async function setProductPrice(
  product_code: number,
  price: number
): Promise<ProductPrice> {
  return RetailManagerApi.post(`/api/product_prices/${product_code}`, {
    price,
  });
}

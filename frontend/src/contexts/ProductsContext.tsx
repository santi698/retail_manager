import { makeLoadableContext } from "./LoadableContext";
import { ProductWithPrice } from "../model";
import { Loadable } from "../Loadable";
import { API_URL } from "../config";

const {
  Provider: ProductsProvider,
  useData: useProducts,
  useRefetch: useRefetchProducts,
} = makeLoadableContext<ProductWithPrice[]>({
  fetchUrl: `${API_URL}/api/products`,
});

export { ProductsProvider, useProducts, useRefetchProducts };

export function useProduct(product_code: number): Loadable<ProductWithPrice> {
  const loadable = useProducts();

  return loadable.map<ProductWithPrice>((products) => {
    const product = products.find(
      (product) => product.product_code === product_code
    );
    if (product === undefined)
      throw new Error(`Product with code ${product_code} not found`);
    return product;
  });
}

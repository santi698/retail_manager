import { makeLoadableContext } from "./LoadableContext";
import { ProductWithPrice } from "../model";
import { Loadable, mapLoadable } from "../Loadable";

const {
  Provider: ProductsProvider,
  useData: useProducts,
} = makeLoadableContext<ProductWithPrice[]>({
  fetchUrl: "http://localhost:5000/products",
  refetchInterval: 60000,
});

export { ProductsProvider, useProducts };

export function useProduct(product_code: number): Loadable<ProductWithPrice> {
  const loadable = useProducts();

  return mapLoadable(loadable, (products) => {
    const product = products.find(
      (product) => product.product_code === product_code
    );
    if (product === undefined)
      throw new Error(`Product with code ${product_code} not found`);
    return product;
  });
}

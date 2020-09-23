import { makeLoadableContext } from "./LoadableContext";
import { ProductWithPrice } from "../model";
import { Loadable } from "../Loadable";

const {
  Provider: ProductsProvider,
  useData: useProducts,
} = makeLoadableContext<ProductWithPrice[]>({
  fetchUrl: "http://192.168.1.104:5000/api/products",
});

export { ProductsProvider, useProducts };

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

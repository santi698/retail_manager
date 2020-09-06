import React from "react";
import { useProducts } from "../contexts/ProductsContext";
import { Table } from "../components/Table";
import { Currency } from "../components/Currency";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";

export function ProductsView() {
  const products = useProducts();
  return (
    <ViewContainer>
      <ViewTitle>Productos</ViewTitle>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio de lista</th>
          </tr>
        </thead>
        <tbody>
          {products.state === "loaded" &&
            products.data.map((product) => (
              <tr key={product.product_code}>
                <td />
                <td>{product.product_name}</td>
                <td>
                  <Currency>{product.list_unit_price}</Currency>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </ViewContainer>
  );
}

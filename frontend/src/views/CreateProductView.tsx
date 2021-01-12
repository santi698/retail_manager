import React from "react";
import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { CreateProductForm } from "../containers/CreateProductForm";
import { simpleFetch } from "../simpleFetch";
import { API_URL } from "../config";
import { useRefetchProducts } from "../contexts/ProductsContext";
import { ProductWithPrice } from "../model";

async function createProduct(product: Omit<ProductWithPrice, "product_code">) {
  simpleFetch(`${API_URL}/api/products`, {
    method: "POST",
    json: product,
    credentials: "include",
  });
}

export function CreateProductView() {
  const navigate = useNavigate();
  const refetchProducts = useRefetchProducts();
  return (
    <ViewContainer>
      <ViewTitle>Cargar cliente nuevo</ViewTitle>
      <CreateProductForm
        onSubmit={({ measurement_unit_id, product_name, price }) => {
          createProduct({
            measurement_unit_id: parseInt(measurement_unit_id),
            product_name,
            list_unit_price: parseFloat(price),
          }).then(() => {
            refetchProducts();
            navigate("/products");
          });
        }}
      />
    </ViewContainer>
  );
}

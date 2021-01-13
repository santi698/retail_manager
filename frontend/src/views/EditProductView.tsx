import React from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { simpleFetch } from "../simpleFetch";
import { Product } from "../model";
import { API_URL } from "../config";
import { useRefetchProducts } from "../contexts/ProductsContext";
import { EditProductForm } from "../containers/EditProductForm";

async function editProduct(
  product_code: number,
  product: Omit<Product, "product_code">
) {
  simpleFetch(`${API_URL}/api/products/${product_code}`, {
    method: "PUT",
    json: product,
    credentials: "include",
  });
}

export function EditProductView() {
  const match = useMatch("/products/:product_code/edit");
  const navigate = useNavigate();
  const refetchProducts = useRefetchProducts();
  if (!match) return null;
  const productCode = parseInt(match.params.product_code);
  return (
    <ViewContainer>
      <ViewTitle>Editar producto</ViewTitle>
      <EditProductForm
        productCode={productCode}
        onSubmit={({ product_name, measurement_unit_id }) => {
          editProduct(productCode, {
            product_name,
            measurement_unit_id: parseInt(measurement_unit_id),
          }).then(() => {
            refetchProducts();
            navigate(`/products/${productCode}`);
          });
        }}
      />
    </ViewContainer>
  );
}

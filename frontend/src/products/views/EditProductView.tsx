import React from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { ViewTitle } from "../../common/components/ViewTitle";
import { ViewContainer } from "../../common/components/ViewContainer";
import { EditProductForm } from "../containers/EditProductForm";
import { editProduct } from "../services/ProductsService";
import { useRefetchProducts } from "../hooks/useRefetchProducts";

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

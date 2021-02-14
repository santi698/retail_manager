import React from "react";
import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../../common/components/ViewTitle";
import { ViewContainer } from "../../common/components/ViewContainer";
import { CreateProductForm } from "../containers/CreateProductForm";
import { createProduct } from "../services/ProductsService";
import { useRefetchProducts } from "../hooks/useRefetchProducts";

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
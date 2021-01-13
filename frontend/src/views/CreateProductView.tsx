import React from "react";
import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { CreateProductForm } from "../containers/CreateProductForm";
import { useRefetchProducts } from "../contexts/ProductsContext";
import { createProduct } from "../services/ProductsService";

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

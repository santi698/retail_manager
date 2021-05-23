import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../../common/components/ViewTitle";
import { CreateProductForm } from "../containers/CreateProductForm";
import { createProduct } from "../services/ProductsService";
import { useRefetchProducts } from "../hooks/useRefetchProducts";
import { parseDecimal } from "../../common/services/decimalNumbers";

export function CreateProductView() {
  const navigate = useNavigate();
  const refetchProducts = useRefetchProducts();
  return (
    <>
      <ViewTitle>Cargar producto nuevo</ViewTitle>
      <CreateProductForm
        onSubmit={({ measurement_unit_id, product_name, price }) => {
          createProduct({
            measurement_unit_id: parseInt(measurement_unit_id),
            product_name,
            list_unit_price: parseDecimal(price),
          }).then(() => {
            refetchProducts();
            navigate("/products");
          });
        }}
      />
    </>
  );
}

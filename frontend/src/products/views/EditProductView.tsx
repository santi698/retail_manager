import { useMatch, useNavigate } from "react-router-dom";
import { ViewTitle } from "../../common/components/ViewTitle";
import { EditProductForm } from "../containers/EditProductForm";
import { editProduct, setProductPrice } from "../services/ProductsService";
import { useRefetchProducts } from "../hooks/useRefetchProducts";
import { parseDecimal } from "../../common/services/decimalNumbers";

export function EditProductView() {
  const match = useMatch("/products/:product_code/edit");
  const navigate = useNavigate();
  const refetchProducts = useRefetchProducts();
  if (!match) return null;
  const productCode = parseInt(match.params.product_code);
  return (
    <>
      <ViewTitle>Editar producto</ViewTitle>
      <EditProductForm
        productCode={productCode}
        onSubmit={async ({ product_name, list_unit_price }) => {
          Promise.allSettled([
            editProduct(productCode, {
              product_name,
            }),
            setProductPrice(productCode, parseDecimal(list_unit_price)),
          ]).then(() => {
            refetchProducts();
            navigate(`/products/${productCode}`);
          });
        }}
      />
    </>
  );
}

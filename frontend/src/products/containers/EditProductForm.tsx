import { Formik } from "formik";
import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  FormControl,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useMeasurementUnits } from "../hooks/useMeasurementUnits";
import { ProductWithPrice } from "../domain/ProductWithPrice";
import { isValidDecimal } from "../../common/services/decimalNumbers";

export interface EditProductFormValues {
  product_name: string;
  list_unit_price: string;
}

function productToForm(product: ProductWithPrice): EditProductFormValues {
  return {
    product_name: product.product_name || "",
    list_unit_price: product.list_unit_price.toString() || "",
  };
}

export interface EditClientFormProps {
  onSubmit: (values: EditProductFormValues) => void;
  productCode: number;
}

export function EditProductForm({
  productCode,
  onSubmit,
}: EditClientFormProps) {
  const product = useProduct(productCode);
  const measurementUnits = useMeasurementUnits();
  if (measurementUnits.status !== "success" || product.status !== "success") {
    return null;
  }
  const initialValues = productToForm(product.data);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
      validate={(values) => {
        const errors: Record<string, string> = {};
        if (
          values.list_unit_price !== "" &&
          !isValidDecimal(values.list_unit_price)
        ) {
          errors.list_unit_price = "El precio debe ser un número";
        }
        return errors;
      }}
    >
      {({
        handleChange,
        handleBlur,
        values,
        handleSubmit,
        isSubmitting,
        isValid,
        errors,
        touched,
      }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing="4">
            <FormControl
              id="product_name"
              isInvalid={
                errors.product_name !== undefined &&
                touched.product_name === true
              }
              isRequired
            >
              <FormLabel>Nombre</FormLabel>
              <Input
                name="product_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.product_name}
              />
              <FormErrorMessage>{errors.product_name}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="list_unit_price"
              isInvalid={
                errors.list_unit_price !== undefined &&
                touched.list_unit_price === true
              }
              isRequired
            >
              <FormLabel>Precio</FormLabel>
              <Input
                name="list_unit_price"
                placeholder="99,99"
                required
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.list_unit_price}
              />
              <FormErrorMessage>{errors.list_unit_price}</FormErrorMessage>
            </FormControl>
            <Stack direction="row">
              <Button
                type="submit"
                disabled={!isValid}
                isLoading={isSubmitting}
              >
                Guardar producto
              </Button>
              <Button as={Link} variant="ghost" to={`/products/${productCode}`}>
                Cancelar y Volver
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Formik>
  );
}

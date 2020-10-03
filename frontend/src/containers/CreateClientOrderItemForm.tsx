import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Select,
  Stack,
} from "@chakra-ui/core";
import { AddIcon } from "@chakra-ui/icons";
import { Formik, useField, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { formatCurrency } from "../components/Currency";
import { useMeasurementUnits } from "../contexts/MeasurementUnitsContext";
import { useProducts } from "../contexts/ProductsContext";

export interface ClientOrderItemForm {
  product_id: string;
  quantity: string;
  selling_price: string;
}

const INITIAL_ORDER_ITEM: ClientOrderItemForm = {
  product_id: "",
  quantity: "",
  selling_price: "",
};

function SellingPriceField(props: Omit<InputProps, "name">) {
  const name = "selling_price";
  const {
    values: { product_id, quantity },
    setFieldValue,
  } = useFormikContext<ClientOrderItemForm>();
  const [field] = useField(name);
  const products = useProducts();

  useEffect(() => {
    if (products.state !== "loaded") return;
    if (product_id.trim() !== "" && quantity.trim() !== "") {
      setFieldValue(
        name,
        (products.data.find(
          (product) => product.product_code === parseInt(product_id)
        )?.list_unit_price || 0) * parseFloat(quantity)
      );
    }
  }, [product_id, quantity, products, setFieldValue, name]);

  if (products.state !== "loaded") return null;
  return <Input {...props} {...field} />;
}

export function CreateClientOrderItemForm({
  onSubmit,
}: {
  onSubmit: (values: ClientOrderItemForm) => void;
}) {
  const products = useProducts();
  const measurementUnits = useMeasurementUnits();

  if (products.state !== "loaded" || measurementUnits.state !== "loaded")
    return null;

  return (
    <Formik
      initialValues={INITIAL_ORDER_ITEM}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
      validate={(values) => {
        const errors: Record<string, string> = {};

        if (values.product_id === "") {
          errors.product_id = "El producto es obligatorio.";
        }

        if (values.quantity === "") {
          errors.quantity = "La cantidad es obligatoria.";
        } else {
          try {
            parseFloat(values.quantity);
          } catch (e) {
            errors.quantity = "La cantidad tiene que ser un número.";
          }
        }

        if (values.selling_price === "") {
          errors.selling_price = "La cantidad es obligatoria.";
        } else {
          try {
            parseFloat(values.selling_price);
          } catch (e) {
            errors.selling_price = "La cantidad tiene que ser un número.";
          }
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
        errors,
        touched,
      }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Stack direction="column">
            <FormControl
              id="product_id"
              isInvalid={
                errors.product_id !== undefined && touched.product_id === true
              }
              isRequired
              size="sm"
            >
              <FormLabel>Producto</FormLabel>
              <Select
                name="product_id"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Seleccioná un producto"
                size="sm"
                value={values.product_id}
              >
                {products.data.map((product) => (
                  <option
                    key={product.product_code}
                    value={product.product_code}
                  >
                    {product.product_name} (
                    {formatCurrency(product.list_unit_price)}
                    {" / "}
                    {
                      measurementUnits.data.find(
                        (unit) => unit.id === product.measurement_unit_id
                      )?.symbol
                    }
                    )
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.product_id}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="quantity"
              isInvalid={
                errors.quantity !== undefined && touched.quantity === true
              }
              isRequired
            >
              <FormLabel>Cantidad</FormLabel>
              <Input
                name="quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                size="sm"
                value={values.quantity}
              />
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="selling_price"
              isDisabled={values.product_id === "" || values.quantity === ""}
              defaultValue={
                products.data.find(
                  (product) =>
                    product.product_code === parseInt(values.product_id)
                )?.list_unit_price
              }
              isInvalid={
                errors.selling_price !== undefined &&
                touched.selling_price === true
              }
              isRequired
            >
              <FormLabel>Precio de venta</FormLabel>
              <SellingPriceField size="sm" />
              <FormErrorMessage>{errors.selling_price}</FormErrorMessage>
            </FormControl>
            <Button
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              rightIcon={<AddIcon />}
            >
              Agregar producto
            </Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
}

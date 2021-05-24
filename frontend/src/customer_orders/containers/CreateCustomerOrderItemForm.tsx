import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Select,
  Stack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Formik, useField, useFormikContext } from "formik";
import { useEffect } from "react";
import { formatCurrency } from "../../common/components/Currency";
import { useMeasurementUnits } from "../../products/hooks/useMeasurementUnits";
import { useProducts } from "../../products/hooks/useProducts";
import {
  isValidDecimal,
  parseDecimal,
} from "../../common/services/decimalNumbers";

export interface CustomerOrderItemForm {
  product_id: string;
  quantity: string;
  selling_price: string;
}

export interface CustomerOrderItemValues {
  product_id: string;
  quantity: number;
  selling_price: number;
}

const INITIAL_ORDER_ITEM: CustomerOrderItemForm = {
  product_id: "",
  quantity: "",
  selling_price: "",
};

function SellingPriceField(props: Omit<InputProps, "name">) {
  const name = "selling_price";
  const {
    values: { product_id, quantity },
    setFieldValue,
    touched,
  } = useFormikContext<CustomerOrderItemForm>();
  const [field] = useField(name);
  const products = useProducts();
  const product = products.data?.find(
    (product) => product.product_code === parseInt(product_id)
  );

  useEffect(() => {
    if (!product) return;
    if (!(touched.product_id && touched.quantity)) return;
    if (product_id.trim() === "" || quantity.trim() === "") return;

    setFieldValue(name, (product?.list_unit_price || 0) * parseFloat(quantity));
  }, [
    product_id,
    quantity,
    product,
    setFieldValue,
    name,
    touched.product_id,
    touched.quantity,
  ]);

  if (products.status !== "success") return null;

  return <Input {...props} {...field} />;
}

export function CreateCustomerOrderItemForm({
  onSubmit,
}: {
  onSubmit: (values: CustomerOrderItemValues) => void;
}) {
  const products = useProducts();
  const measurementUnits = useMeasurementUnits();

  if (products.status !== "success" || measurementUnits.status !== "success") {
    return null;
  }

  return (
    <Formik
      initialValues={INITIAL_ORDER_ITEM}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit({
          ...values,
          selling_price: parseDecimal(values.selling_price),
          quantity: parseDecimal(values.quantity),
        });
        setSubmitting(false);
      }}
      validate={(values) => {
        const errors: Record<string, string> = {};

        if (values.product_id === "") {
          errors.product_id = "El producto es obligatorio.";
        }

        if (values.quantity === "") {
          errors.quantity = "La cantidad es obligatoria.";
        } else if (!isValidDecimal(values.quantity)) {
          errors.quantity = "La cantidad tiene que ser un número.";
        }

        if (values.selling_price === "") {
          errors.selling_price = "La cantidad es obligatoria.";
        } else if (!isValidDecimal(values.selling_price)) {
          errors.selling_price = "La cantidad tiene que ser un número.";
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
        dirty,
      }) => {
        const currentProduct = products.data.find(
          ({ product_code }) => product_code === parseInt(values.product_id)
        );

        const currentMeasurementUnit = measurementUnits.data.find(
          ({ id }) => id === currentProduct?.measurement_unit_id
        );
        console.log(dirty, isValid);
        return (
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
                <FormLabel>
                  Cantidad{" "}
                  {currentMeasurementUnit &&
                    `(${
                      currentMeasurementUnit?.symbol === ""
                        ? currentMeasurementUnit.unit_name
                        : currentMeasurementUnit?.symbol
                    })`}
                </FormLabel>
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
                isInvalid={
                  errors.selling_price !== undefined &&
                  touched.selling_price === true
                }
                isRequired
              >
                <FormLabel>Precio de venta ($)</FormLabel>
                <SellingPriceField size="sm" />
                <FormErrorMessage>{errors.selling_price}</FormErrorMessage>
              </FormControl>
              <Button
                size="sm"
                type="submit"
                isLoading={isSubmitting}
                disabled={!dirty || !isValid}
                rightIcon={<AddIcon />}
              >
                Agregar producto
              </Button>
            </Stack>
          </form>
        );
      }}
    </Formik>
  );
}

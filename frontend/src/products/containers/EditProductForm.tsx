import React from "react";
import { Formik } from "formik";
import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  FormControl,
  Select,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Product } from "../domain/Product";
import { useProduct } from "../hooks/useProduct";
import { useMeasurementUnits } from "../hooks/useMeasurementUnits";

export interface EditProductRequest {
  product_name: string;
  measurement_unit_id: string;
}

function productToForm(product: Product): EditProductRequest {
  return {
    product_name: product.product_name || "",
    measurement_unit_id: product.measurement_unit_id.toString() || "",
  };
}

export interface EditClientFormProps {
  onSubmit: (values: EditProductRequest) => void;
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
        if (values.product_name === "") {
          errors.product_name = "La ciudad es obligatoria";
        }
        if (values.measurement_unit_id === "") {
          errors.measurement_unit_id = "La unidad de medida es obligatoria";
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
              id="measurement_unit_id"
              isInvalid={
                errors.measurement_unit_id !== undefined &&
                touched.measurement_unit_id === true
              }
              isRequired
            >
              <FormLabel>Unidad de medida</FormLabel>
              <Select
                name="measurement_unit_id"
                placeholder="Selecciona la unidad de medida"
                required
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.measurement_unit_id}
              >
                {measurementUnits.data.map((measurementUnit) => (
                  <option key={measurementUnit.id} value={measurementUnit.id}>
                    {measurementUnit.unit_name} ({measurementUnit.symbol})
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.measurement_unit_id}</FormErrorMessage>
            </FormControl>
            <Stack direction="row">
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={isSubmitting}
              >
                Guardar producto
              </Button>
              <Button
                as={Link}
                colorScheme="purple"
                variant="ghost"
                to={`/products/${productCode}`}
              >
                Cancelar y Volver
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Formik>
  );
}

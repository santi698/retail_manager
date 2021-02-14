import React from "react";
import { Formik } from "formik";
import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Select,
  FormControl,
} from "@chakra-ui/react";
import { useMeasurementUnits } from "../hooks/useMeasurementUnits";

export interface CreateProductRequest {
  product_name: string;
  measurement_unit_id: string;
  price: string;
}

export function CreateProductForm({
  onSubmit,
}: {
  onSubmit: (values: CreateProductRequest) => void;
}) {
  const measurementUnits = useMeasurementUnits();
  if (measurementUnits.status !== "success") return null;
  const initialValues: CreateProductRequest = {
    product_name: "",
    measurement_unit_id: "",
    price: "",
  };
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
          errors.product_name = "El nombre del producto es obligatorio";
        }
        if (values.price === "") {
          errors.price = "El precio del producto es obligatorio";
        } else if (!values.price.match(/\d+[.,]\d+/)) {
          errors.price = "El precio debe ser un número decimal";
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
                required
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
            <FormControl
              id="price"
              isInvalid={errors.price !== undefined && touched.price === true}
              isRequired
            >
              <FormLabel>Precio por unidad de medida</FormLabel>
              <Input
                name="price"
                required
                onBlur={handleBlur}
                onChange={handleChange}
                pattern="\d+[.,]\d+"
                value={values.price}
              />
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>
            <Stack direction="row">
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={isSubmitting}
              >
                Crear producto
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Formik>
  );
}

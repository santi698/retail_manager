import React from "react";
import { Formik } from "formik";
import {
  Stack,
  FormLabel,
  FormErrorMessage,
  Button,
  Select,
  FormControl,
} from "@chakra-ui/react";
import { useCities } from "../../cities/useCities";
import { useCustomers } from "../../customers/useCustomers";

export interface CreateCustomerOrderRequest {
  customer_id: string;
  order_city_id: string;
}

export function CreateCustomerOrderForm({
  onSubmit,
}: {
  onSubmit: (values: CreateCustomerOrderRequest) => void;
}) {
  const cities = useCities();
  const customers = useCustomers();
  if (cities.status !== "success" || customers.status !== "success")
    return null;
  const initialValues: CreateCustomerOrderRequest = {
    customer_id: "",
    order_city_id: "",
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
        if (values.order_city_id === "") {
          errors.order_city_id = "La ciudad es obligatoria";
        }
        if (values.customer_id === "") {
          errors.customer_id = "El cliente es oblicatorio";
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
      }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing="4">
            <FormControl
              id="order_city_id"
              isInvalid={
                errors.order_city_id !== undefined &&
                touched.order_city_id === true
              }
              isRequired
            >
              <FormLabel>Ciudad</FormLabel>
              <Select
                name="order_city_id"
                placeholder="Selecciona la ciudad del pedido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.order_city_id}
              >
                {cities.data.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.order_city_id}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="customer_id"
              isDisabled={values.order_city_id === ""}
              isInvalid={
                errors.customer_id !== undefined && touched.customer_id === true
              }
              isRequired
            >
              <FormLabel>Cliente</FormLabel>
              <Select
                name="customer_id"
                placeholder="Selecciona el cliente"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.customer_id}
              >
                {values.order_city_id !== "" &&
                  customers.data
                    .filter(
                      (customer) =>
                        customer.residence_city_id ===
                        parseInt(values.order_city_id)
                    )
                    .map((customer) => (
                      <option
                        key={customer.customer_id}
                        value={customer.customer_id}
                      >
                        {customer.first_name} {customer.last_name}
                      </option>
                    ))}
              </Select>
              <FormErrorMessage>{errors.customer_id}</FormErrorMessage>
            </FormControl>
            <Stack direction="row">
              <Button
                isLoading={isSubmitting}
                disabled={!dirty || !isValid}
                type="submit"
              >
                Guardar y agregar productos
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Formik>
  );
}

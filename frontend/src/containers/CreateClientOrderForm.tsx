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
import { useCities } from "../contexts/CitiesContext";
import { useClients } from "../contexts/ClientsContext";

export interface CreateClientOrderRequest {
  client_id: string;
  order_city_id: string;
}

export function CreateClientOrderForm({
  onSubmit,
}: {
  onSubmit: (values: CreateClientOrderRequest) => void;
}) {
  const cities = useCities();
  const clients = useClients();
  if (cities.state !== "loaded" || clients.state !== "loaded") return null;
  const initialValues: CreateClientOrderRequest = {
    client_id: "",
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
        if (values.client_id === "") {
          errors.client_id = "El cliente es oblicatorio";
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
              id="client_id"
              isDisabled={values.order_city_id === ""}
              isInvalid={
                errors.client_id !== undefined && touched.client_id === true
              }
              isRequired
            >
              <FormLabel>Cliente</FormLabel>
              <Select
                name="client_id"
                placeholder="Selecciona el cliente"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.client_id}
              >
                {values.order_city_id !== "" &&
                  clients.data
                    .filter(
                      (client) =>
                        client.residence_city_id ===
                        parseInt(values.order_city_id)
                    )
                    .map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.first_name} {client.last_name}
                      </option>
                    ))}
              </Select>
              <FormErrorMessage>{errors.client_id}</FormErrorMessage>
            </FormControl>
            <Stack direction="row">
              <Button
                colorScheme="purple"
                isLoading={isSubmitting}
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

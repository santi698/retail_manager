import React from "react";
import { Formik } from "formik";
import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  InputLeftAddon,
  InputGroup,
  Button,
  Select,
  FormControl,
} from "@chakra-ui/react";
import { PhoneIcon, AtSignIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { useClient } from "../contexts/ClientsContext";
import { Client } from "../model";

export interface EditClientRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  residence_city_id: string;
  address: string;
}

function clientToForm(client: Client): EditClientRequest {
  return {
    first_name: client.first_name || "",
    last_name: client.last_name || "",
    email: client.email || "",
    phone_number: client.phone_number || "",
    residence_city_id: client.residence_city_id.toString(),
    address: client.address || "",
  };
}

export interface EditClientFormProps {
  onSubmit: (values: EditClientRequest) => void;
  clientId: number;
}

export function EditClientForm({ clientId, onSubmit }: EditClientFormProps) {
  const cities = useCities();
  const client = useClient(clientId);
  if (cities.state !== "loaded" || client.state !== "loaded") return null;
  const initialValues = clientToForm(client.data);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
      validate={(values) => {
        const errors: Record<string, string> = {};
        if (values.phone_number === "") {
          errors.phone_number = "El número de teléfono es obligatorio";
        } else if (!/(\d(-|.| )?){8,10}/.test(values.phone_number)) {
          errors.phone_number =
            "El número de teléfono es inválido, debe contener al menos 8 dígitos";
        }
        if (values.residence_city_id === "") {
          errors.residence_city_id = "La ciudad es obligatoria";
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
              id="first_name"
              isInvalid={
                errors.first_name !== undefined && touched.first_name === true
              }
            >
              <FormLabel>Nombre</FormLabel>
              <Input
                name="first_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
              />
              <FormErrorMessage>{errors.first_name}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="last_name"
              isInvalid={
                errors.last_name !== undefined && touched.last_name === true
              }
            >
              <FormLabel>Apellido</FormLabel>
              <Input
                name="last_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
              />
              <FormErrorMessage>{errors.last_name}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="email"
              isInvalid={errors.email !== undefined && touched.email === true}
            >
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  {<AtSignIcon color="gray.500" />}
                </InputLeftAddon>
                <Input
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </InputGroup>
            </FormControl>
            <FormControl
              colorScheme="purple"
              id="phone_number"
              isInvalid={
                errors.phone_number !== undefined &&
                touched.phone_number === true
              }
              isRequired
            >
              <FormLabel>Teléfono</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  {<PhoneIcon color="gray.500" />}
                </InputLeftAddon>
                <Input
                  name="phone_number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="phone"
                  value={values.phone_number}
                />
              </InputGroup>
              <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="residence_city_id"
              isInvalid={
                errors.residence_city_id !== undefined &&
                touched.residence_city_id === true
              }
              isRequired
            >
              <FormLabel>Ciudad</FormLabel>
              <Select
                name="residence_city_id"
                placeholder="Selecciona la ciudad del cliente"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.residence_city_id}
              >
                {cities.data.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.residence_city_id}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="address"
              isInvalid={
                errors.address !== undefined && touched.address === true
              }
            >
              <FormLabel>Dirección</FormLabel>
              <Input
                name="address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
              />
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            </FormControl>
            <Stack direction="row">
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={isSubmitting}
              >
                Guardar cliente
              </Button>
              <Button
                as={Link}
                colorScheme="purple"
                variant="ghost"
                to={`/clients/${clientId}`}
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

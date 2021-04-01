import React from "react";
import { Table } from "../common/components/Table";
import { useCustomers } from "./useCustomers";
import { ViewTitle } from "../common/components/ViewTitle";
import { ViewContainer } from "../common/components/ViewContainer";
import { useCities } from "../cities/useCities";
import { Button, Stack, Flex, Box } from "@chakra-ui/react";
import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { InvisibleButton } from "../common/components/InvisibleButton";
import { BsPlus } from "react-icons/bs";

export function CustomersView() {
  const customers = useCustomers();
  const cities = useCities();
  return (
    <ViewContainer>
      <ViewTitle>Clientes</ViewTitle>
      <Flex justify="space-between">
        <Box />
        <Box>
          <InvisibleButton
            as={Link}
            colorScheme="purple"
            leftIcon={<BsPlus size="1.5em" />}
            to="/customers/create"
          >
            Nuevo cliente
          </InvisibleButton>
        </Box>
      </Flex>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.status === "success" &&
            cities.status === "success" &&
            customers.data.map((customer) => (
              <tr key={customer.customer_id}>
                <td />
                <td>{`${customer.first_name} ${customer.last_name}`}</td>
                <td>{customer.email}</td>
                <td>{customer.phone_number}</td>
                <td>
                  {
                    cities.data.find(
                      (city) => city.id === customer.residence_city_id
                    )?.name
                  }
                </td>
                <td>
                  <Stack direction="row">
                    <Button
                      as={Link}
                      leftIcon={<ViewIcon />}
                      size="xs"
                      to={`/customers/${customer.customer_id}`}
                    >
                      Ver
                    </Button>
                    <Button
                      as={Link}
                      leftIcon={<EditIcon />}
                      size="xs"
                      to={`/customers/${customer.customer_id}/edit`}
                    >
                      Editar
                    </Button>
                  </Stack>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </ViewContainer>
  );
}

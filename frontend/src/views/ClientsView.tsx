import React from "react";
import { Table } from "../components/Table";
import { useClients } from "../contexts/ClientsContext";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { useCities } from "../contexts/CitiesContext";
import { Button, Stack, Flex, Box } from "@chakra-ui/core";
import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { InvisibleButton } from "../components/InvisibleButton";
import { BsPlus } from "react-icons/bs";

export function ClientsView() {
  const clients = useClients();
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
            to="/clients/create"
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
          {clients.state === "loaded" &&
            cities.state === "loaded" &&
            clients.data.map((client) => (
              <tr key={client.client_id}>
                <td />
                <td>{`${client.first_name} ${client.last_name}`}</td>
                <td>{client.email}</td>
                <td>{client.phone_number}</td>
                <td>
                  {
                    cities.data.find(
                      (city) => city.id === client.residence_city_id
                    )?.name
                  }
                </td>
                <td>
                  <Stack direction="row">
                    <Button
                      as={Link}
                      leftIcon={<ViewIcon />}
                      size="xs"
                      to={`/clients/${client.client_id}`}
                    >
                      Ver
                    </Button>
                    <Button
                      as={Link}
                      leftIcon={<EditIcon />}
                      size="xs"
                      to={`/clients/${client.client_id}/edit`}
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

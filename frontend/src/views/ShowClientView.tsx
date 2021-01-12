import React from "react";
import { useClient } from "../contexts/ClientsContext";
import { ViewContainer } from "../components/ViewContainer";
import { useCities } from "../contexts/CitiesContext";
import { Link, useMatch } from "react-router-dom";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useClientOrders } from "../contexts/ClientOrdersContext";
import { Currency } from "../components/Currency";
import { Table } from "../components/Table";
import { translateOrderStatus } from "../translateOrderStatus";
import { translatePaymentStatus } from "../translatePaymentStatus";
import { StatusBadge } from "../components/StatusBadge";
import { orderStatusToColorVariant } from "../orderStatusToColorVariant";
import { paymentStatusToColorVariant } from "../paymentStatusToColorVariant";
import { EditIcon } from "@chakra-ui/icons";

export function ShowClientView() {
  const match = useMatch("/clients/:id");
  const clientId = match?.params.id;
  const client = useClient(
    clientId !== undefined ? parseInt(clientId) : clientId
  );
  const cities = useCities();
  const allOrders = useClientOrders();

  if (
    client.state !== "loaded" ||
    cities.state !== "loaded" ||
    allOrders.state !== "loaded"
  ) {
    return null;
  }
  const clientOrders = allOrders.data.filter(
    (order) => order.client_id === client.data.client_id
  );
  return (
    <ViewContainer>
      <Box
        border="1px solid"
        padding={2}
        borderColor="gray.300"
        borderRadius="9px"
      >
        <Heading as="h2" fontSize="2xl" mb={2}>
          {client.data.first_name} {client.data.last_name}
        </Heading>
        <Stack direction="row" marginY={2}>
          <Button
            as={Link}
            leftIcon={<EditIcon />}
            size="sm"
            to={`/clients/${client.data.client_id}/edit`}
          >
            Editar
          </Button>
        </Stack>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Teléfono:</strong> {client.data.phone_number}
        </Text>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Email:</strong> {client.data.email}
        </Text>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Ciudad:</strong>{" "}
          {
            cities.data.find(
              (city) => city.id === client.data.residence_city_id
            )?.name
          }
        </Text>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Dirección:</strong> {client.data.address}
        </Text>

        <Box mt={2} width="300px">
          <Heading fontSize="xl">Pedidos</Heading>
          <Table>
            <thead>
              <tr>
                <th>No. de pedido</th>
                <th>Estado del pedido</th>
                <th>Estado del pago</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {clientOrders.map((order) => (
                <tr>
                  <td>{order.order_id}</td>
                  <td>
                    <StatusBadge
                      colorVariant={orderStatusToColorVariant(
                        order.order_status
                      )}
                    >
                      {translateOrderStatus(order.order_status)}
                    </StatusBadge>
                  </td>
                  <td>
                    <StatusBadge
                      colorVariant={paymentStatusToColorVariant(
                        order.payment_status
                      )}
                    >
                      {translatePaymentStatus(order.payment_status)}
                    </StatusBadge>
                  </td>
                  <td>
                    <Currency>{order.total_price}</Currency>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </Box>
    </ViewContainer>
  );
}

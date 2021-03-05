import React from "react";
import { useCustomer } from "./useCustomer";
import { ViewContainer } from "../common/components/ViewContainer";
import { useCities } from "../cities/useCities";
import { Link, useMatch } from "react-router-dom";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useCustomerOrders } from "../customer_orders/hooks/useCustomerOrders";
import { Currency } from "../common/components/Currency";
import { Table } from "../common/components/Table";
import { StatusBadge } from "../common/components/StatusBadge";
import { orderStatusToColorVariant } from "../customer_orders/orderStatusToColorVariant";
import { paymentStatusToColorVariant } from "../customer_orders/paymentStatusToColorVariant";
import { EditIcon } from "@chakra-ui/icons";

export function ShowCustomerView() {
  const match = useMatch("/customers/:id");
  const customerId = match?.params.id;
  const customer = useCustomer(
    customerId !== undefined ? parseInt(customerId) : customerId
  );
  const cities = useCities();
  const allOrders = useCustomerOrders();

  if (
    customer.status !== "success" ||
    cities.status !== "success" ||
    allOrders.status !== "success"
  ) {
    return null;
  }
  const customerOrders = allOrders.data.filter(
    (order) => order.customer_id === customer.data.customer_id
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
          {customer.data.first_name} {customer.data.last_name}
        </Heading>
        <Stack direction="row" marginY={2}>
          <Button
            as={Link}
            leftIcon={<EditIcon />}
            size="sm"
            to={`/customers/${customer.data.customer_id}/edit`}
          >
            Editar
          </Button>
        </Stack>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Teléfono:</strong> {customer.data.phone_number}
        </Text>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Email:</strong> {customer.data.email}
        </Text>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Ciudad:</strong>{" "}
          {
            cities.data.find(
              (city) => city.id === customer.data.residence_city_id
            )?.name
          }
        </Text>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Dirección:</strong> {customer.data.address}
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
              {customerOrders.map((order) => (
                <tr>
                  <td>{order.order_id}</td>
                  <td>
                    <StatusBadge
                      colorVariant={orderStatusToColorVariant(
                        order.order_status.value
                      )}
                      options={[]}
                      onChange={() => {}}
                      value={order.order_status.value}
                    />
                  </td>
                  <td>
                    <StatusBadge
                      colorVariant={paymentStatusToColorVariant(
                        order.payment_status.value
                      )}
                      options={[]}
                      onChange={() => {}}
                      value={order.payment_status.value}
                    />
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

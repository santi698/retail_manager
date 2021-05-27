import { Link, useMatch } from "react-router-dom";
import {
  Button,
  Heading,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Table,
  TableCaption,
  HStack,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useCities } from "../cities/useCities";
import { useCustomerOrders } from "../customer_orders/hooks/useCustomerOrders";
import { Currency } from "../common/components/Currency";
import { StatusBadge } from "../common/components/StatusBadge";
import { useCustomer } from "./useCustomer";

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
    <>
      <HStack marginY={2}>
        <Heading as="h2" fontSize="2xl" mb={2}>
          {customer.data.first_name} {customer.data.last_name}
        </Heading>
        <Button
          as={Link}
          leftIcon={<EditIcon />}
          size="sm"
          to={`/customers/${customer.data.customer_id}/edit`}
        >
          Editar
        </Button>
      </HStack>
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

      <Table>
        <TableCaption fontSize="xl" placement="top">
          Pedidos
        </TableCaption>
        <Thead>
          <Tr>
            <Th>No. de pedido</Th>
            <Th>Estado del pedido</Th>
            <Th isNumeric>Monto</Th>
          </Tr>
        </Thead>
        <Tbody>
          {customerOrders.map((order) => (
            <Tr>
              <Td>{order.order_id}</Td>
              <Td>
                <StatusBadge value={order.order_status} />
              </Td>
              <Td isNumeric>
                <Currency>{order.total_price}</Currency>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}

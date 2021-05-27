import React from "react";
import { Tbody, Th, Thead, Tr, Table } from "@chakra-ui/table";
import { CustomerOrder } from "../CustomerOrder";
import { useCustomers } from "../../customers/useCustomers";
import { editCustomerOrder } from "../services/CustomerOrdersService";
import { useRefetchCustomerOrders } from "../hooks/useRefetchCustomerOrders";
import { OrderRow } from "./OrderRow";

export function OrdersTable({ orders }: { orders: CustomerOrder[] | null }) {
  const refetchCustomerOrders = useRefetchCustomerOrders();
  const customers = useCustomers();
  if (customers.status !== "success") return null;

  if (orders === null) return null;

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Id. de pedido</Th>
          <Th>Ciudad</Th>
          <Th>Fecha</Th>
          <Th>Cliente</Th>
          <Th>Estado del pedido</Th>
          <Th isNumeric>Total</Th>
          <Th isNumeric>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orders.map((order) => {
          if (customers === null) return null;
          const customer = customers.data.find(
            (customer) => customer.customer_id === order.customer_id
          );
          if (customer === undefined) {
            throw new Error("Customer must exist for all orders");
          }
          return (
            <OrderRow
              customer={customer}
              key={order.order_id}
              order={order}
              onChange={async (order) => {
                await editCustomerOrder(order.order_id, order);
                refetchCustomerOrders();
              }}
            />
          );
        })}
      </Tbody>
    </Table>
  );
}

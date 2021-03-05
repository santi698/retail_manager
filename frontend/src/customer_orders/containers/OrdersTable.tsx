import React from "react";
import { CustomerOrder } from "../CustomerOrder";
import { OrderRow } from "./OrderRow";
import { Table } from "../../common/components/Table";
import { useCustomers } from "../../customers/useCustomers";
import { editCustomerOrder } from "../services/CustomerOrdersService";
import { useRefetchCustomerOrders } from "../hooks/useRefetchCustomerOrders";

export function OrdersTable({ orders }: { orders: CustomerOrder[] | null }) {
  const refetchCustomerOrders = useRefetchCustomerOrders();
  const customers = useCustomers();
  if (customers.status !== "success") return null;

  if (orders === null) return null;

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Id. de pedido</th>
          <th>Ciudad</th>
          <th>Fecha</th>
          <th>Customere</th>
          <th>Estado del pago</th>
          <th>Estado del pedido</th>
          <th className="currency">Total</th>
          <th />
        </tr>
      </thead>
      <tbody>
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
      </tbody>
    </Table>
  );
}

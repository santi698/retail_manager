import React from "react";
import { ClientOrder } from "../../domain/ClientOrder";
import { OrderRow } from "./OrderRow";
import { Table } from "../../common/components/Table";
import { useClients } from "../../clients/useClients";

export function OrdersTable({ orders }: { orders: ClientOrder[] | null }) {
  const clients = useClients();
  if (clients.status !== "success") return null;

  if (orders === null) return null;

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Id. de pedido</th>
          <th>Ciudad</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Estado del pago</th>
          <th>Estado del pedido</th>
          <th className="currency">Total</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          if (clients === null) return null;
          const client = clients.data.find(
            (client) => client.client_id === order.client_id
          );
          if (client === undefined) {
            throw new Error("Client must exist for all orders");
          }
          return (
            <OrderRow client={client} key={order.order_id} order={order} />
          );
        })}
      </tbody>
    </Table>
  );
}

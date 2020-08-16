import React from "react";
import { useClients } from "../hooks/useClients";
import { ClientOrder } from "../model";
import { OrderRow } from "./OrderRow";

export function OrdersTable({ orders }: { orders: ClientOrder[] | null }) {
  const clients = useClients();

  if (orders === null) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Id. de pedido</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Estado del pago</th>
          <th>Estado del pedido</th>
          <th className="currency">Total</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => {
          const client = clients?.find(
            (client) => client.client_id === order.client_id
          );
          if (client === undefined) {
            throw new Error("Client must exist for all orders");
          }
          return <OrderRow client={client} order={order} />;
        })}
      </tbody>
    </table>
  );
}

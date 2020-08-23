import React from "react";
import { ClientOrder } from "../model";
import { OrderRow } from "./OrderRow";
import { Table } from "../components/Table";
import { useClients } from "../contexts/ClientsContext";

export function OrdersTable({ orders }: { orders: ClientOrder[] | null }) {
  const loadingClients = useClients();
  if (loadingClients.state !== "loaded") return null;
  const clients = loadingClients.data;

  if (orders === null) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
            const client = clients.find(
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
    </div>
  );
}

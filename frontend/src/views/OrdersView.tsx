import React from "react";
import { OrdersTable } from "../containers/OrdersTable";
import { useClientOrders } from "../contexts/ClientOrdersContext";
export function OrdersView() {
  const clientOrders = useClientOrders();
  return (
    <>
      <h1>Pedidos</h1>
      {clientOrders.status === "loaded" && (
        <OrdersTable orders={clientOrders.data} />
      )}
    </>
  );
}

import React from "react";
import { useClientOrders } from "../hooks/useClientOrders";
import { OrdersTable } from "../containers/OrdersTable";
export function OrdersView() {
  const clientOrders = useClientOrders();
  return (
    <>
      <h1>Pedidos</h1>
      <OrdersTable orders={clientOrders} />
    </>
  );
}

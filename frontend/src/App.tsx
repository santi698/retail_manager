import React from "react";
import { useClientOrders } from "./hooks/useClientOrders";
import { OrdersTable } from "./containers/OrdersTable";

function App() {
  const clientOrders = useClientOrders();
  return (
    <div>
      <h1>Pedidos</h1>
      <OrdersTable orders={clientOrders} />
    </div>
  );
}

export default App;

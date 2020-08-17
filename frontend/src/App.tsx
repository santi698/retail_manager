import React from "react";
import { useClientOrders } from "./hooks/useClientOrders";
import { OrdersTable } from "./containers/OrdersTable";
import styled from "styled-components";

const Layout = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 80px 1fr 240px;
  grid-template-areas: "navBar main sidebar";
  grid-template-rows: 100%;
`;

function App() {
  const clientOrders = useClientOrders();
  return (
    <Layout>
      <div
        style={{
          gridArea: "navBar",
          height: "100%",
          boxShadow: "0 0 16px rgba(0,0,0,0.1)",
        }}
      ></div>
      <div style={{ gridArea: "main", padding: "16px" }}>
        <h1>Pedidos</h1>
        <OrdersTable orders={clientOrders} />
      </div>
      <div style={{ background: "#f9f8ff" }}></div>
    </Layout>
  );
}

export default App;

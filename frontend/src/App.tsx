import React from "react";
import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import styled from "styled-components";
import { OrdersView } from "./views/OrdersView";
import { StatsView } from "./views/StatsView";
import { ClientsView } from "./views/ClientsView";
import { ProductsView } from "./views/ProductsView";

const Layout = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 80px 1fr 240px;
  grid-template-areas: "navBar main sidebar";
  grid-template-rows: 100%;
`;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <div
          style={{
            gridArea: "navBar",
            height: "100%",
            boxShadow: "0 0 16px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Link to="/">Vista General</Link>
          <Link to="/orders">Pedidos</Link>
          <Link to="/products">Productos</Link>
          <Link to="/clients">Clientes</Link>
        </div>
        <div style={{ gridArea: "main", padding: "16px" }}>
          <Routes>
            <Route path="/" element={<StatsView />} />
            <Route path="/orders" element={<OrdersView />} />
            <Route path="/clients" element={<ClientsView />} />
            <Route path="/products" element={<ProductsView />} />
          </Routes>
        </div>
        <div style={{ background: "#f9f8ff" }}></div>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import { OrdersView } from "./views/OrdersView";
import { StatsView } from "./views/StatsView";
import { ClientsView } from "./views/ClientsView";
import { ProductsView } from "./views/ProductsView";
import { ProductsProvider } from "./contexts/ProductsContext";
import { MeasurementUnitsProvider } from "./contexts/MeasurementUnitsContext";
import { ClientsProvider } from "./contexts/ClientsContext";
import { ClientOrdersProvider } from "./contexts/ClientOrdersContext";
import { CitiesProvider } from "./contexts/CitiesContext";
import { NavBar } from "./NavBar";
import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import theme from "./theme";

const Layout = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 80px 1fr 240px;
  grid-template-areas: "navBar main sidebar";
  grid-template-rows: 100%;
`;

const GLOBAL_REFETCH_INTERVAL = 60000;

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CitiesProvider refetchInterval={GLOBAL_REFETCH_INTERVAL}>
        <ClientOrdersProvider refetchInterval={GLOBAL_REFETCH_INTERVAL}>
          <ClientsProvider refetchInterval={GLOBAL_REFETCH_INTERVAL}>
            <ProductsProvider refetchInterval={GLOBAL_REFETCH_INTERVAL}>
              <MeasurementUnitsProvider
                refetchInterval={GLOBAL_REFETCH_INTERVAL}
              >
                {children}
              </MeasurementUnitsProvider>
            </ProductsProvider>
          </ClientsProvider>
        </ClientOrdersProvider>
      </CitiesProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <CSSReset />
      <BrowserRouter>
        <Layout>
          <NavBar />
          <div style={{ gridArea: "main", padding: "48px" }}>
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
    </AppProviders>
  );
}

export default App;

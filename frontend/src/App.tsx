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
import {
  ChakraProvider,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Container,
} from "@chakra-ui/core";
import theme from "./theme";
import { CreateOrderView } from "./views/CreateOrderView";
import { CreateClientView } from "./views/CreateClientView";
import { EditClientView } from "./views/EditClientView";
import { ShowClientView } from "./views/ShowClientView";
import { AuthProvider } from "./contexts/AuthContext";
import { EditOrderView } from "./views/EditOrderView";

const Layout = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 80px 1fr 240px;
  grid-template-areas: "navBar main sidebar";
  grid-template-rows: 100%;
`;

const GLOBAL_REFETCH_INTERVAL = 600000;

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <AuthProvider>
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
      </AuthProvider>
    </ChakraProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Layout>
          <NavBar />
          <div style={{ gridArea: "main", padding: "48px" }}>
            <Routes>
              <Route path="/" element={<StatsView />} />
              <Route path="/orders" element={<OrdersView />} />
              <Route path="/orders/:id" element={<OrdersView />} />
              <Route path="/orders/:id/edit" element={<EditOrderView />} />
              <Route path="/orders/create" element={<CreateOrderView />} />
              <Route path="/clients" element={<ClientsView />} />
              <Route path="/clients/create" element={<CreateClientView />} />
              <Route path="/clients/:id/edit" element={<EditClientView />} />
              <Route path="/clients/:id" element={<ShowClientView />} />
              <Route path="/products" element={<ProductsView />} />
            </Routes>
          </div>
          <Container background="#f9f8ff" centerContent>
            <Stack padding="4">
              <Stat>
                <StatLabel>Pedidos</StatLabel>
                <StatNumber>43</StatNumber>
                <StatHelpText>12/08 - 28/08</StatHelpText>
              </Stat>
            </Stack>
          </Container>
        </Layout>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;

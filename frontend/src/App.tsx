import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import {
  ChakraProvider,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Container,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "./auth/AuthContext";

import { OrdersView } from "./client_orders/views/OrdersView";
import { StatsView } from "./common/views/StatsView";
import { ClientsView } from "./clients/ClientsView";
import { ProductsView } from "./products/views/ProductsView";
import { CreateOrderView } from "./client_orders/views/CreateOrderView";
import { CreateClientView } from "./clients/CreateClientView";
import { EditClientView } from "./clients/EditClientView";
import { ShowClientView } from "./clients/ShowClientView";
import { EditOrderView } from "./client_orders/views/EditOrderView";
import { CreateProductView } from "./products/views/CreateProductView";
import { EditProductView } from "./products/views/EditProductView";
import { ShowProductView } from "./products/views/ShowProductView";

import { NavBar } from "./NavBar";
import theme from "./theme";

const Layout = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 80px 1fr 240px;
  grid-template-areas: "navBar main sidebar";
  grid-template-rows: 100%;
`;

const queryClient = new QueryClient();

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} resetCSS>
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
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
              <Route path="/products/create" element={<CreateProductView />} />
              <Route
                path="/products/:product_code"
                element={<ShowProductView />}
              />
              <Route
                path="/products/:product_code/edit"
                element={<EditProductView />}
              />
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

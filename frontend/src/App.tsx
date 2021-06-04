import "@fontsource/raleway/400.css";
import "@fontsource/raleway/700.css";
import "@fontsource/raleway/900.css";
import "@fontsource/nunito-sans/400.css";

import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import styled from "styled-components";
import { Box, ChakraProvider, Container } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "./auth/AuthContext";
import { OrdersView } from "./customer_orders/views/OrdersView";
import { CustomersView } from "./customers/CustomersView";
import { ProductsView } from "./products/views/ProductsView";
import { CreateOrderView } from "./customer_orders/views/CreateOrderView";
import { CreateCustomerView } from "./customers/CreateCustomerView";
import { EditCustomerView } from "./customers/EditCustomerView";
import { ShowCustomerView } from "./customers/ShowCustomerView";
import { EditOrderView } from "./customer_orders/views/EditOrderView";
import { CreateProductView } from "./products/views/CreateProductView";
import { EditProductView } from "./products/views/EditProductView";
import { ShowProductView } from "./products/views/ShowProductView";

import { NavBar } from "./NavBar";
import theme from "./theme";
import { SettingsView } from "./settings/SettingsView";

const Layout = styled.div`
  display: grid;
  height: 100vh;
  overflow: hidden;
  grid-template-columns: 200px 1fr;
  grid-template-areas: "navBar main";
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
          <Box bg="brand.50" p="6" overflow="auto">
            <Container
              maxW="container.xl"
              style={{ gridArea: "main" }}
              bg="white"
              py="6"
              px="12"
              border="1px solid var(--chakra-colors-gray-100)"
              borderRadius="9px"
            >
              <Routes>
                <Route path="/" element={<Navigate to="/orders" replace />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/orders" element={<OrdersView />} />
                <Route path="/orders/:id" element={<OrdersView />} />
                <Route path="/orders/:id/edit" element={<EditOrderView />} />
                <Route path="/orders/create" element={<CreateOrderView />} />
                <Route path="/customers" element={<CustomersView />} />
                <Route
                  path="/customers/create"
                  element={<CreateCustomerView />}
                />
                <Route
                  path="/customers/:id/edit"
                  element={<EditCustomerView />}
                />
                <Route path="/customers/:id" element={<ShowCustomerView />} />
                <Route path="/products" element={<ProductsView />} />
                <Route
                  path="/products/create"
                  element={<CreateProductView />}
                />
                <Route
                  path="/products/:product_code"
                  element={<ShowProductView />}
                />
                <Route
                  path="/products/:product_code/edit"
                  element={<EditProductView />}
                />
              </Routes>
            </Container>
          </Box>
        </Layout>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;

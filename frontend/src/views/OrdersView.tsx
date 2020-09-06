import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";

import { OrdersTable } from "../containers/OrdersTable";
import { useClientOrders } from "../contexts/ClientOrdersContext";
import { useCities } from "../contexts/CitiesContext";
import { ClientOrderStatus, ClientOrderPaymentStatus } from "../model";
import { translatePaymentStatus } from "../translatePaymentStatus";
import { translateOrderStatus } from "../translateOrderStatus";
import { InvisibleButton } from "../components/InvisibleButton";
import { ViewTitle } from "../components/ViewTitle";
import {
  FormControl,
  Select,
  FormLabel,
  Flex,
  Box,
  Stack,
} from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { ViewContainer } from "../components/ViewContainer";

export interface OrdersViewFilters {
  order_city_id: string;
  order_status: ClientOrderStatus | "";
  payment_status: ClientOrderPaymentStatus | "";
}

export function OrdersView() {
  const clientOrders = useClientOrders();
  const cities = useCities();
  const [filters, setFilters] = useState<OrdersViewFilters>({
    order_city_id: "",
    order_status: "",
    payment_status: "",
  });
  return (
    <ViewContainer>
      <ViewTitle>Pedidos</ViewTitle>
      <Flex justify="space-between" align="end">
        <Stack direction="row" spacing={4}>
          <FormControl>
            <FormLabel htmlFor="city">Ciudad</FormLabel>
            <Select
              id="city"
              placeholder="Todas las ciudades"
              onChange={(e) => {
                const value = e.target.value;
                setFilters((prev) => ({
                  ...prev,
                  order_city_id: value,
                }));
              }}
              value={filters.order_city_id}
            >
              {cities.state === "loaded" &&
                cities.data.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="order_status">Estado del pedido</FormLabel>
            <Select
              id="order_status"
              onChange={(e) => {
                const value = e.target.value;

                setFilters((prev) => ({
                  ...prev,
                  order_status: value as ClientOrderStatus,
                }));
              }}
              placeholder="Todos los estados"
              value={filters.order_status}
            >
              {["draft", "confirmed", "delivered", "cancelled"].map(
                (status) => (
                  <option key={status} value={status}>
                    {translateOrderStatus(status as ClientOrderStatus)}
                  </option>
                )
              )}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Estado del pago</FormLabel>
            <Select
              id="payment_status"
              placeholder="Todos los estados"
              onChange={(e) => {
                const value = e.target.value;
                setFilters((prev) => ({
                  ...prev,
                  payment_status: value as ClientOrderPaymentStatus,
                }));
              }}
              value={filters.payment_status}
            >
              {["pending", "paid", "cancelled"].map((status) => (
                <option key={status} value={status}>
                  {translatePaymentStatus(status as ClientOrderPaymentStatus)}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Box>
          <InvisibleButton
            as={Link}
            colorScheme="purple"
            leftIcon={<BsPlus size="1.5em" />}
            to="/orders/create"
          >
            Nuevo pedido
          </InvisibleButton>
        </Box>
      </Flex>
      <Box mt={4}>
        {clientOrders.state === "loaded" && (
          <OrdersTable
            orders={clientOrders.data
              .filter(
                (order) =>
                  filters.order_city_id === "" ||
                  order.order_city_id === parseInt(filters.order_city_id)
              )
              .filter(
                (order) =>
                  filters.order_status === "" ||
                  order.order_status === filters.order_status
              )
              .filter(
                (order) =>
                  filters.payment_status === "" ||
                  order.payment_status === filters.payment_status
              )}
          />
        )}
      </Box>
    </ViewContainer>
  );
}

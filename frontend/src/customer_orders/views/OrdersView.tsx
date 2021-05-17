import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";

import { OrdersTable } from "../containers/OrdersTable";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import { useCities } from "../../cities/useCities";
import { InvisibleButton } from "../../common/components/InvisibleButton";
import { ViewTitle } from "../../common/components/ViewTitle";
import {
  FormControl,
  Select,
  FormLabel,
  Flex,
  Box,
  Stack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ViewContainer } from "../../common/components/ViewContainer";
import { OrderStatus, OrderStatusValue } from "../OrderStatus";

export interface OrdersViewFilters {
  order_city_id: string;
  order_status: OrderStatusValue | "";
}

export function OrdersView() {
  const customerOrders = useCustomerOrders();
  const cities = useCities();
  const [filters, setFilters] = useState<OrdersViewFilters>({
    order_city_id: "",
    order_status: "",
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
              {cities.status === "success" &&
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
                  order_status:
                    value === "" ? "" : OrderStatus.from(value).value,
                }));
              }}
              placeholder="Todos los estados"
              value={filters.order_status}
            >
              {["draft", "confirmed", "delivered", "canceled"].map((status) => (
                <option key={status} value={status}>
                  {OrderStatus.from(status).label()}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Box>
          <InvisibleButton
            as={Link}
            leftIcon={<BsPlus size="1.5em" />}
            to="/orders/create"
          >
            Nuevo pedido
          </InvisibleButton>
        </Box>
      </Flex>
      <Box mt={4}>
        {customerOrders.status === "success" && (
          <OrdersTable
            orders={customerOrders.data
              .filter(
                (order) =>
                  filters.order_city_id === "" ||
                  order.order_city_id === parseInt(filters.order_city_id)
              )
              .filter(
                (order) =>
                  filters.order_status === "" ||
                  order.order_status.value === filters.order_status
              )}
          />
        )}
      </Box>
    </ViewContainer>
  );
}

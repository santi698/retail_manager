import { useState } from "react";
import { BsPlus } from "react-icons/bs";

import {
  FormControl,
  Select,
  FormLabel,
  Flex,
  Box,
  Stack,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { OrdersTable } from "../containers/OrdersTable";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import { useCities } from "../../cities/useCities";
import { ViewTitle } from "../../common/components/ViewTitle";
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
    <>
      <ViewTitle>Pedidos</ViewTitle>
      <VStack align="flex-start" spacing={6}>
        <Flex justify="space-between" align="end" width="100%">
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
                {["draft", "confirmed", "delivered", "canceled"].map(
                  (status) => (
                    <option key={status} value={status}>
                      {OrderStatus.from(status).label()}
                    </option>
                  )
                )}
              </Select>
            </FormControl>
          </Stack>
          <Box>
            <Button
              as={Link}
              leftIcon={<BsPlus size="1.5em" />}
              to="/orders/create"
            >
              Nuevo pedido
            </Button>
          </Box>
        </Flex>
        <Box>
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
      </VStack>
    </>
  );
}

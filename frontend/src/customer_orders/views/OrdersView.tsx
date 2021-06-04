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
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { OrdersTable } from "../containers/OrdersTable";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import { useCities } from "../../cities/useCities";
import { ViewTitle } from "../../common/components/ViewTitle";
import { OrderStatusValue } from "../OrderStatus";

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
                {cities.status === "success" ? (
                  cities.data.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando ciudades...</option>
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
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Pedidos pendientes</Tab>
            <Tab>Pedidos finalizados</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {customerOrders.status !== "success" ? (
                <OrdersTable isLoading />
              ) : (
                <OrdersTable
                  orders={customerOrders.data
                    .filter(
                      (order) =>
                        filters.order_city_id === "" ||
                        order.order_city_id === parseInt(filters.order_city_id)
                    )
                    .filter((order) => !order.order_status.isFinished())}
                />
              )}
            </TabPanel>
            <TabPanel>
              {customerOrders.status !== "success" ? (
                <OrdersTable isLoading />
              ) : (
                <OrdersTable
                  orders={customerOrders.data
                    .filter(
                      (order) =>
                        filters.order_city_id === "" ||
                        order.order_city_id === parseInt(filters.order_city_id)
                    )
                    .filter((order) => order.order_status.isFinished())}
                />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </>
  );
}

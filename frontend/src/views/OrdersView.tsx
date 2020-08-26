import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";

import { OrdersTable } from "../containers/OrdersTable";
import { useClientOrders } from "../contexts/ClientOrdersContext";
import { useCities } from "../contexts/CitiesContext";
import { Select } from "../components/Select";
import { ClientOrderStatus, ClientOrderPaymentStatus } from "../model";
import { translatePaymentStatus } from "../translatePaymentStatus";
import { translateOrderStatus } from "../translateOrderStatus";
import { InvisibleButton } from "../components/InvisibleButton";

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
    <>
      <h1>Pedidos</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 12em)",
            gridColumnGap: "8px",
          }}
        >
          {cities.state === "loaded" && (
            <Select
              id="city"
              name="city"
              label="Ciudad"
              onChange={(e) => {
                const value = e.target.value;
                setFilters((prev) => ({
                  ...prev,
                  order_city_id: value,
                }));
              }}
              value={filters.order_city_id}
            >
              <option value="">Todas las ciudades</option>
              {cities.data.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Select>
          )}
          <Select
            id="order_status"
            name="order_status"
            label="Estado del pedido"
            onChange={(e) => {
              const value = e.target.value;

              setFilters((prev) => ({
                ...prev,
                order_status: value as ClientOrderStatus,
              }));
            }}
            value={filters.order_status}
          >
            <option value="">Todos los estados</option>
            {["draft", "confirmed", "delivered", "cancelled"].map((status) => (
              <option key={status} value={status}>
                {translateOrderStatus(status as ClientOrderStatus)}
              </option>
            ))}
          </Select>
          <Select
            id="payment_status"
            name="payment_status"
            label="Estado del pago"
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({
                ...prev,
                payment_status: value as ClientOrderPaymentStatus,
              }));
            }}
            value={filters.payment_status}
          >
            <option value="">Todos los estados</option>
            {["pending", "paid", "cancelled"].map((status) => (
              <option key={status} value={status}>
                {translatePaymentStatus(status as ClientOrderPaymentStatus)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <InvisibleButton>
            <BsPlus size="1.5em" /> Nuevo pedido
          </InvisibleButton>
        </div>
      </div>
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
    </>
  );
}

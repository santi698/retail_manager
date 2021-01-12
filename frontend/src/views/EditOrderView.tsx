import React from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { simpleFetch } from "../simpleFetch";
import {
  ClientOrder,
  ClientOrderPaymentStatus,
  ClientOrderStatus,
} from "../model";
import { EditOrderForm } from "../containers/EditOrderForm";
import { useRefetchClientOrders } from "../contexts/ClientOrdersContext";
import { API_URL } from "../config";

async function editOrder(
  id: number,
  order: Omit<ClientOrder, "order_id" | "ordered_at">
) {
  simpleFetch(`${API_URL}/api/client_orders/${id}`, {
    method: "PUT",
    json: order,
    credentials: "include",
  });
}

export function EditOrderView() {
  const match = useMatch("/orders/:id/edit");
  const navigate = useNavigate();
  const refetchClientOrders = useRefetchClientOrders();
  if (!match) return null;
  const clientOrderId = parseInt(match.params.id);
  return (
    <ViewContainer>
      <ViewTitle>Completar Pedido</ViewTitle>
      <EditOrderForm
        clientOrderId={clientOrderId}
        onSubmit={({
          address,
          client_id,
          order_city_id,
          order_status,
          payment_status,
          total_price,
        }) => {
          editOrder(clientOrderId, {
            address,
            client_id: parseInt(client_id),
            order_city_id: parseInt(order_city_id),
            order_status: order_status as ClientOrderStatus,
            payment_status: payment_status as ClientOrderPaymentStatus,
            total_price: parseFloat(total_price),
          }).then(() => {
            refetchClientOrders();
            navigate(`/orders`);
          });
        }}
      />
    </ViewContainer>
  );
}

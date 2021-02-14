import React from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { ViewTitle } from "../../common/components/ViewTitle";
import { ViewContainer } from "../../common/components/ViewContainer";
import {
  ClientOrderPaymentStatus,
  ClientOrderStatus,
} from "../../domain/ClientOrder";
import { EditOrderForm } from "../containers/EditOrderForm";
import { useRefetchClientOrders } from "../hooks/useRefetchClientOrders";
import { editClientOrder } from "../services/ClientOrdersService";

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
          editClientOrder(clientOrderId, {
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

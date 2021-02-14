import React, { useState } from "react";
import { ViewTitle } from "../../common/components/ViewTitle";
import { Stack } from "@chakra-ui/react";
import { CardButton } from "../../common/components/CardButton";
import { useCities } from "../../cities/useCities";
import { useClients } from "../../clients/useClients";
import { ViewContainer } from "../../common/components/ViewContainer";
import { CreateClientOrderForm } from "../containers/CreateClientOrderForm";
import { useNavigate } from "react-router-dom";
import { createClientOrder } from "../services/ClientOrdersService";

function CreateOrderForm() {
  const [isNewClient, setIsNewClient] = useState<boolean | null>(null);
  const cities = useCities();
  const clients = useClients();
  const navigate = useNavigate();
  if (cities.status !== "success" || clients.status !== "success") return null;
  if (isNewClient === null) {
    return (
      <Stack direction="row">
        <CardButton onClick={() => setIsNewClient(true)}>
          Cliente nuevo
        </CardButton>
        <CardButton onClick={() => setIsNewClient(false)}>
          Cliente existente
        </CardButton>
      </Stack>
    );
  }

  if (isNewClient === true) {
    return <></>;
  }
  return (
    <CreateClientOrderForm
      onSubmit={(clientOrder) => {
        createClientOrder({
          client_id: parseInt(clientOrder.client_id),
          order_city_id: parseInt(clientOrder.order_city_id),
        })
          .then((response) => response.json())
          .then((order) => {
            navigate(`/orders/${order.order_id}`);
          });
      }}
    />
  );
}

export function CreateOrderView() {
  return (
    <ViewContainer>
      <ViewTitle>Cargar nuevo pedido</ViewTitle>
      <CreateOrderForm />
    </ViewContainer>
  );
}

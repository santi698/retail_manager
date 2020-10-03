import React, { useState } from "react";
import { ViewTitle } from "../components/ViewTitle";
import { Stack } from "@chakra-ui/core";
import { CardButton } from "../components/CardButton";
import { useCities } from "../contexts/CitiesContext";
import { useClients } from "../contexts/ClientsContext";
import { ViewContainer } from "../components/ViewContainer";
import { CreateClientOrderForm } from "../containers/CreateClientOrderForm";
import { simpleFetch } from "../simpleFetch";
import { useNavigate } from "react-router-dom";

function CreateOrderForm() {
  const [isNewClient, setIsNewClient] = useState<boolean | null>(null);
  const cities = useCities();
  const clients = useClients();
  const navigate = useNavigate();
  if (cities.state !== "loaded" || clients.state !== "loaded") return null;
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
        simpleFetch("http://192.168.1.104:5000/api/client_orders", {
          method: "POST",
          json: {
            client_id: parseInt(clientOrder.client_id),
            order_city_id: parseInt(clientOrder.order_city_id),
          },
          credentials: "include",
        })
          .response.then((response) => response.json())
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

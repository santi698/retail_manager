import React, { useState } from "react";
import { ViewTitle } from "../components/ViewTitle";
import { Stack, FormControl, FormLabel, Select } from "@chakra-ui/core";
import { CardButton } from "../components/CardButton";
import { useCities } from "../contexts/CitiesContext";
import { useClients } from "../contexts/ClientsContext";
import { ViewContainer } from "../components/ViewContainer";

function CreateOrderForm() {
  const [isNewClient, setIsNewClient] = useState<boolean | null>(null);
  const cities = useCities();
  const clients = useClients();
  const [selectedCityId, setSelectedCityId] = useState<string>("");
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
    <Stack as="form" spacing="4">
      <FormControl>
        <FormLabel>Ciudad</FormLabel>
        <Select
          id="city"
          onChange={(e) => setSelectedCityId(e.target.value)}
          placeholder="Seleccioná una ciudad"
          value={selectedCityId}
        >
          {cities.data.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isDisabled={selectedCityId === ""}>
        <FormLabel>Cliente</FormLabel>
        <Select id="client_id" placeholder="Seleccioná un cliente">
          {clients.data
            .filter(
              (client) => client.residence_city_id === parseInt(selectedCityId)
            )
            .map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.first_name} {client.last_name}
              </option>
            ))}
        </Select>
      </FormControl>
    </Stack>
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

import React from "react";
import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { CreateClientForm } from "../containers/CreateClientForm";
import { simpleFetch } from "../simpleFetch";
import { Client } from "../model";
import { useRefetchClients } from "../contexts/ClientsContext";

async function createClient(client: Omit<Client, "client_id">) {
  simpleFetch("http://192.168.0.110:5000/clients", {
    method: "POST",
    json: client,
    credentials: "include",
  });
}

export function CreateClientView() {
  const navigate = useNavigate();
  const refetchClients = useRefetchClients();
  return (
    <ViewContainer>
      <ViewTitle>Cargar cliente nuevo</ViewTitle>
      <CreateClientForm
        onSubmit={({
          first_name,
          last_name,
          email,
          phone_number,
          residence_city_id,
          address,
        }) => {
          createClient({
            first_name,
            last_name,
            email,
            phone_number,
            residence_city_id: parseInt(residence_city_id),
            address,
          }).then(() => {
            refetchClients();
            navigate("/clients");
          });
        }}
      />
    </ViewContainer>
  );
}

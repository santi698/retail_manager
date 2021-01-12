import React from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { simpleFetch } from "../simpleFetch";
import { Client } from "../model";
import { useRefetchClients } from "../contexts/ClientsContext";
import { EditClientForm } from "../containers/EditClientForm";
import { API_URL } from "../config";

async function editClient(id: number, client: Omit<Client, "client_id">) {
  simpleFetch(`${API_URL}/api/clients/${id}`, {
    method: "PUT",
    json: client,
    credentials: "include",
  });
}

export function EditClientView() {
  const match = useMatch("/clients/:id/edit");
  const navigate = useNavigate();
  const refetchClients = useRefetchClients();
  if (!match) return null;
  const clientId = parseInt(match.params.id);
  return (
    <ViewContainer>
      <ViewTitle>Editar cliente</ViewTitle>
      <EditClientForm
        clientId={clientId}
        onSubmit={({
          first_name,
          last_name,
          email,
          phone_number,
          residence_city_id,
          address,
        }) => {
          editClient(clientId, {
            first_name,
            last_name,
            email,
            phone_number,
            residence_city_id: parseInt(residence_city_id),
            address,
          }).then(() => {
            refetchClients();
            navigate(`/clients/${clientId}`);
          });
        }}
      />
    </ViewContainer>
  );
}

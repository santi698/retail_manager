import React from "react";
import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { CreateClientForm } from "../containers/CreateClientForm";
import { useRefetchClients } from "../contexts/ClientsContext";
import { createClient } from "../services/ClientsService";

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

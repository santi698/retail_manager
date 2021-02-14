import React from "react";
import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../common/components/ViewTitle";
import { ViewContainer } from "../common/components/ViewContainer";
import { CreateClientForm } from "./CreateClientForm";
import { createClient } from "./ClientsService";
import { useRefetchClients } from "./useRefetchClients";

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

import React from "react";
import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../common/components/ViewTitle";
import { ViewContainer } from "../common/components/ViewContainer";
import { CreateCustomerForm } from "./CreateCustomerForm";
import { createCustomer } from "./CustomersService";
import { useRefetchCustomers } from "./useRefetchCustomers";

export function CreateCustomerView() {
  const navigate = useNavigate();
  const refetchCustomers = useRefetchCustomers();
  return (
    <ViewContainer>
      <ViewTitle>Cargar customere nuevo</ViewTitle>
      <CreateCustomerForm
        onSubmit={({
          first_name,
          last_name,
          email,
          phone_number,
          residence_city_id,
          address,
        }) => {
          createCustomer({
            first_name,
            last_name,
            email,
            phone_number,
            residence_city_id: parseInt(residence_city_id),
            address,
          }).then(() => {
            refetchCustomers();
            navigate("/customers");
          });
        }}
      />
    </ViewContainer>
  );
}
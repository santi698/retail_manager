import React, { useState } from "react";
import { ViewTitle } from "../../common/components/ViewTitle";
import { Stack } from "@chakra-ui/react";
import { CardButton } from "../../common/components/CardButton";
import { useCities } from "../../cities/useCities";
import { useCustomers } from "../../customers/useCustomers";
import { ViewContainer } from "../../common/components/ViewContainer";
import { CreateCustomerOrderForm } from "../containers/CreateCustomerOrderForm";
import { useNavigate } from "react-router-dom";
import { createCustomerOrder } from "../services/CustomerOrdersService";

function CreateOrderForm() {
  const [isNewCustomer, setIsNewCustomer] = useState<boolean | null>(null);
  const cities = useCities();
  const customers = useCustomers();
  const navigate = useNavigate();
  if (cities.status !== "success" || customers.status !== "success")
    return null;
  if (isNewCustomer === null) {
    return (
      <Stack direction="row">
        <CardButton onClick={() => setIsNewCustomer(true)}>
          Customere nuevo
        </CardButton>
        <CardButton onClick={() => setIsNewCustomer(false)}>
          Customere existente
        </CardButton>
      </Stack>
    );
  }

  if (isNewCustomer === true) {
    return <></>;
  }
  return (
    <CreateCustomerOrderForm
      onSubmit={(customerOrder) => {
        createCustomerOrder({
          customer_id: parseInt(customerOrder.customer_id),
          order_city_id: parseInt(customerOrder.order_city_id),
        }).then((order) => {
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

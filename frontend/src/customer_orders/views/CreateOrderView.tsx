import { useState } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ViewTitle } from "../../common/components/ViewTitle";
import { useCities } from "../../cities/useCities";
import { useCustomers } from "../../customers/useCustomers";
import { CreateCustomerOrderForm } from "../containers/CreateCustomerOrderForm";
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
        <Button onClick={() => navigate("/customers/create")}>
          Cliente nuevo
        </Button>
        <Button onClick={() => setIsNewCustomer(false)}>
          Cliente existente
        </Button>
      </Stack>
    );
  }

  return (
    <CreateCustomerOrderForm
      onSubmit={(customerOrder) => {
        createCustomerOrder({
          customer_id: parseInt(customerOrder.customer_id),
          order_city_id: parseInt(customerOrder.order_city_id),
        }).then((order) => {
          navigate(`/orders/${order.order_id}/edit`);
        });
      }}
    />
  );
}

export function CreateOrderView() {
  return (
    <>
      <ViewTitle>Cargar nuevo pedido</ViewTitle>
      <CreateOrderForm />
    </>
  );
}

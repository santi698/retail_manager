import { useQueryClient } from "react-query";

export function useRefetchCustomerOrders() {
  const client = useQueryClient();
  return () => {
    client.invalidateQueries("customer_orders");
  };
}

import { useQueryClient } from "react-query";

export function useRefetchClientOrders() {
  const client = useQueryClient();
  return () => {
    client.invalidateQueries("client_orders");
  };
}

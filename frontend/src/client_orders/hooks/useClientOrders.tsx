import { useQuery } from "react-query";
import { getClientOrders } from "../services/ClientOrdersService";

export function useClientOrders() {
  return useQuery("client_orders", () => getClientOrders());
}

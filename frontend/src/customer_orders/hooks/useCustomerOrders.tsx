import { useQuery } from "react-query";
import { getCustomerOrders } from "../services/CustomerOrdersService";

export function useCustomerOrders() {
  return useQuery("customer_orders", () => getCustomerOrders());
}

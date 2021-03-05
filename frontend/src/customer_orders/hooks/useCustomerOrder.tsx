import { useQuery } from "react-query";
import { getCustomerOrder } from "../services/CustomerOrdersService";

export function useCustomerOrder(id: number) {
  return useQuery(["customer_orders", { id }], () => getCustomerOrder(id));
}

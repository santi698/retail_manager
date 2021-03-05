import { CustomerOrderItem } from "../CustomerOrderItem";
import { useQuery } from "react-query";
import { getCustomerOrderItems } from "../services/CustomerOrdersService";

export function useCustomerOrderItems(id: number) {
  return useQuery<CustomerOrderItem[]>(["customer_order_items", id], () =>
    getCustomerOrderItems(id)
  );
}

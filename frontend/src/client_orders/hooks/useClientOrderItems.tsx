import { ClientOrderItem } from "../../domain/ClientOrderItem";
import { useQuery } from "react-query";
import { getClientOrderItems } from "../services/ClientOrdersService";

export function useClientOrderItems(id: number) {
  return useQuery<ClientOrderItem[]>(["client_order_items", id], () =>
    getClientOrderItems(id)
  );
}

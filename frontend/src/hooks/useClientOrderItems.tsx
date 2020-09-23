import { useFetch } from "./useFetch";
import { ClientOrderItem } from "../model";

export function useClientOrderItems(id: number) {
  return useFetch<ClientOrderItem[]>(
    `http://192.168.1.104:5000/api/client_orders/${id}/items`
  );
}

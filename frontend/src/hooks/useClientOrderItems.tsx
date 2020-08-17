import { useFetch } from "./useFetch";
import { ClientOrderItem } from "../model";

export function useClientOrderItems(id: number) {
  return useFetch<ClientOrderItem[]>(
    `http://localhost:5000/client_orders/${id}/items`
  );
}

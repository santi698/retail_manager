import { useFetch } from "./useFetch";
import { ClientOrderItem } from "../model";
import { API_URL } from "../config";

export function useClientOrderItems(id: number) {
  return useFetch<ClientOrderItem[]>(
    `${API_URL}/api/client_orders/${id}/items`
  );
}

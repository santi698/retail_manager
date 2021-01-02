import { useFetch } from "./useFetch";
import { ClientOrderItem } from "../model";

export function useClientOrderItems(id: number) {
  return useFetch<ClientOrderItem[]>(
    `http://192.168.0.110:5000/api/client_orders/${id}/items`
  );
}

import { useFetch } from "./useFetch";
import { ClientOrder } from "../model";

export function useClientOrders() {
  return useFetch<ClientOrder[]>("http://localhost:5000/client_orders");
}

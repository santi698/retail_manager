import { useQuery } from "react-query";
import { getClientOrder } from "../services/ClientOrdersService";

export function useClientOrder(id: number) {
  return useQuery(["client_orders", { id }], () => getClientOrder(id));
}

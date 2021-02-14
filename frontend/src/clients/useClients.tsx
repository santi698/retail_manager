import { useQuery } from "react-query";
import { getClients } from "./ClientsService";

export function useClients() {
  return useQuery("clients", () => getClients());
}

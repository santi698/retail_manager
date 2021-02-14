import { useQuery } from "react-query";
import { Client } from "../domain/Client";
import { getClient } from "./ClientsService";

export function useClient(id: number | undefined) {
  return useQuery<Client>(
    ["clients", id],
    ({ queryKey }) => getClient(queryKey[1]),
    {
      enabled: id !== undefined,
    }
  );
}

import { useFetch } from "./useFetch";
import { Client } from "../model";

export function useClients() {
  return useFetch<Client[]>("http://localhost:5000/clients");
}

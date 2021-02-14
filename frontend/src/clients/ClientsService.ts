import { Client } from "../domain/Client";
import { RetailManagerApi } from "../common/services/RetailManagerApi";

export async function getClient(client_id: number) {
  return RetailManagerApi.get<Client>(`/api/clients/${client_id}`);
}

export async function getClients() {
  return RetailManagerApi.get<Client[]>(`/api/clients`);
}

export async function createClient(client: Omit<Client, "client_id">) {
  return RetailManagerApi.post(`/api/clients`, client);
}

export async function editClient(
  id: number,
  client: Omit<Client, "client_id">
) {
  return RetailManagerApi.put(`/api/clients/${id}`, client);
}

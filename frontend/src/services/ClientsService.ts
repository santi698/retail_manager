import { API_URL } from "../config";
import { Client } from "../model";
import { RetailManagerApi } from "./RetailManagerApi";

export async function createClient(client: Omit<Client, "client_id">) {
  return RetailManagerApi.post(`${API_URL}/api/clients`, client);
}

export async function editClient(
  id: number,
  client: Omit<Client, "client_id">
) {
  return RetailManagerApi.put(`${API_URL}/api/clients/${id}`, client);
}

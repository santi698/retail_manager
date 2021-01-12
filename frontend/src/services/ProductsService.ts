import { API_URL } from "../config";
import { ClientOrderItem } from "../model";
import { simpleFetch } from "../simpleFetch";

export type CreateClientOrderItemRequest = Omit<
  ClientOrderItem,
  "client_order_item_id"
>;

export type DeleteClientOrderItemRequest = Pick<
  ClientOrderItem,
  "client_order_item_id" | "client_order_id"
>;

export function createClientOrderItem({
  client_order_id,
  ...rest
}: CreateClientOrderItemRequest) {
  return simpleFetch(`${API_URL}/api/client_orders/${client_order_id}/items`, {
    method: "POST",
    json: rest,
    credentials: "include",
  }).response;
}

export function deleteClientOrderItem({
  client_order_id,
  client_order_item_id,
}: DeleteClientOrderItemRequest) {
  return simpleFetch(
    `${API_URL}/api/client_orders/${client_order_id}/items/${client_order_item_id}`,
    { method: "DELETE", credentials: "include" }
  ).response;
}
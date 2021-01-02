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
  return simpleFetch(
    `http://192.168.0.110:5000/api/client_orders/${client_order_id}/items`,
    { method: "POST", json: rest, credentials: "include" }
  ).response;
}

export function deleteClientOrderItem({
  client_order_id,
  client_order_item_id,
}: DeleteClientOrderItemRequest) {
  return simpleFetch(
    `http://192.168.0.110:5000/api/client_orders/${client_order_id}/items/${client_order_item_id}`,
    { method: "DELETE", credentials: "include" }
  ).response;
}

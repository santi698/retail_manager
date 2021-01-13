import { API_URL } from "../config";
import { ClientOrder, ClientOrderItem } from "../model";
import { RetailManagerApi } from "./RetailManagerApi";

export function createClientOrder(
  order: Pick<ClientOrder, "client_id" | "order_city_id">
) {
  return RetailManagerApi.post(`${API_URL}/api/client_orders`, {
    client_id: order.client_id,
    order_city_id: order.order_city_id,
  });
}

export async function editClientOrder(
  id: number,
  order: Omit<ClientOrder, "order_id" | "ordered_at">
) {
  return RetailManagerApi.put(`${API_URL}/api/client_orders/${id}`, order);
}

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
  return RetailManagerApi.post(
    `${API_URL}/api/client_orders/${client_order_id}/items`,
    rest
  );
}

export function deleteClientOrderItem({
  client_order_id,
  client_order_item_id,
}: DeleteClientOrderItemRequest) {
  return RetailManagerApi.delete(
    `${API_URL}/api/client_orders/${client_order_id}/items/${client_order_item_id}`
  );
}

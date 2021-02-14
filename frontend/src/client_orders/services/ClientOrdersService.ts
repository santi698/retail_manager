import { ClientOrderItem } from "../../domain/ClientOrderItem";
import { ClientOrder } from "../../domain/ClientOrder";
import { RetailManagerApi } from "../../common/services/RetailManagerApi";

export function createClientOrder(
  order: Pick<ClientOrder, "client_id" | "order_city_id">
) {
  return RetailManagerApi.post(`/api/client_orders`, {
    client_id: order.client_id,
    order_city_id: order.order_city_id,
  });
}

export async function getClientOrder(id: number): Promise<ClientOrder> {
  return RetailManagerApi.get<ClientOrder>(`/api/client_orders/${id}`);
}

export async function getClientOrders(): Promise<ClientOrder[]> {
  return RetailManagerApi.get<ClientOrder[]>(`/api/client_orders`);
}

export async function editClientOrder(
  id: number,
  order: Omit<ClientOrder, "order_id" | "ordered_at">
) {
  return RetailManagerApi.put(`/api/client_orders/${id}`, order);
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
    `/api/client_orders/${client_order_id}/items`,
    rest
  );
}

export function getClientOrderItems(client_order_id: number) {
  return RetailManagerApi.get<ClientOrderItem[]>(
    `/api/client_orders/${client_order_id}/items`
  );
}

export function deleteClientOrderItem({
  client_order_id,
  client_order_item_id,
}: DeleteClientOrderItemRequest) {
  return RetailManagerApi.delete(
    `/api/client_orders/${client_order_id}/items/${client_order_item_id}`
  );
}

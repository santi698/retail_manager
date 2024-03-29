import { useMutation, useQueryClient } from "react-query";
import { CustomerOrderItem } from "../CustomerOrderItem";
import { CustomerOrder } from "../CustomerOrder";
import {
  ApiCustomerOrder,
  RetailManagerApi,
} from "../../common/services/RetailManagerApi";
import { OrderStatus } from "../OrderStatus";

function mapApiCustomerOrder({ order_status, ...rest }: ApiCustomerOrder) {
  return {
    ...rest,
    order_status: OrderStatus.from(order_status),
  };
}

export function createCustomerOrder(
  order: Pick<CustomerOrder, "customer_id" | "order_city_id">
) {
  return RetailManagerApi.post<ApiCustomerOrder>(`/api/customer_orders`, {
    customer_id: order.customer_id,
    order_city_id: order.order_city_id,
  });
}

export async function getCustomerOrder(id: number): Promise<CustomerOrder> {
  return RetailManagerApi.get<ApiCustomerOrder>(
    `/api/customer_orders/${id}`
  ).then(mapApiCustomerOrder);
}

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  return RetailManagerApi.get<ApiCustomerOrder[]>(`/api/customer_orders`).then(
    (orders) => orders.map(mapApiCustomerOrder)
  );
}

export async function editCustomerOrder(
  id: number,
  order: Omit<CustomerOrder, "order_id" | "ordered_at">
) {
  return RetailManagerApi.put(`/api/customer_orders/${id}`, order);
}

export type CreateCustomerOrderItemRequest = Omit<
  CustomerOrderItem,
  "customer_order_item_id"
>;

export type DeleteCustomerOrderItemRequest = Pick<
  CustomerOrderItem,
  "customer_order_item_id" | "customer_order_id"
>;

export function createCustomerOrderItem({
  customer_order_id,
  ...rest
}: CreateCustomerOrderItemRequest) {
  return RetailManagerApi.post(
    `/api/customer_orders/${customer_order_id}/items`,
    rest
  );
}

export function getCustomerOrderItems(customer_order_id: number) {
  return RetailManagerApi.get<CustomerOrderItem[]>(
    `/api/customer_orders/${customer_order_id}/items`
  );
}

export function deleteCustomerOrderItem({
  customer_order_id,
  customer_order_item_id,
}: DeleteCustomerOrderItemRequest) {
  return RetailManagerApi.delete(
    `/api/customer_orders/${customer_order_id}/items/${customer_order_item_id}`
  );
}

interface DeleteContext {
  previousItems: CustomerOrderItem[] | undefined;
  newItems: CustomerOrderItem[];
}

export function useDeleteCustomerOrderItem() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    DeleteCustomerOrderItemRequest,
    DeleteContext
  >("deleteCustomerOrderItem", deleteCustomerOrderItem, {
    onMutate: async ({ customer_order_id, customer_order_item_id }) => {
      const queryKey = ["customer_order_items", customer_order_id];
      await queryClient.cancelQueries(queryKey);
      const previousItems =
        queryClient.getQueryData<CustomerOrderItem[]>(queryKey);
      const newItems = (previousItems || []).filter(
        (item) => item.customer_order_item_id !== customer_order_item_id
      );
      queryClient.setQueryData(queryKey, newItems);

      return { previousItems, newItems };
    },
    onSettled: (_data, _error, { customer_order_id }) => {
      const queryKey = ["customer_order_items", customer_order_id];
      queryClient.invalidateQueries(queryKey);
    },
    onError: (_error, { customer_order_id }, context) => {
      const queryKey = ["customer_order_items", customer_order_id];
      queryClient.setQueryData(queryKey, context?.previousItems);
    },
  });
}

import { OrderStatus } from "./OrderStatus";

export interface CustomerOrder {
  order_id: number;
  customer_id: number;
  ordered_at: string;
  order_city_id: number;
  order_status: OrderStatus;
  total_price: number;
  address: string | null;
}

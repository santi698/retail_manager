import { OrderStatus } from "./OrderStatus";
import { PaymentStatus } from "./PaymentStatus";

export interface CustomerOrder {
  order_id: number;
  customer_id: number;
  ordered_at: string;
  order_city_id: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  total_price: number;
  address: string | null;
}

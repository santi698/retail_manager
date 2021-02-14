export type ClientOrderStatus =
  | "draft"
  | "confirmed"
  | "cancelled"
  | "delivered";

export type ClientOrderPaymentStatus = "pending" | "paid" | "cancelled";

export interface ClientOrder {
  order_id: number;
  client_id: number;
  ordered_at: string;
  order_city_id: number;
  order_status: ClientOrderStatus;
  payment_status: ClientOrderPaymentStatus;
  total_price: number;
  address: string | null;
}

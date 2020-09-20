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

export interface ClientOrderItem {
  client_order_id: number;
  client_order_item_id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
}

export interface Client {
  client_id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  residence_city_id: number;
  address?: string;
}

export interface Product {
  product_code: number;
  product_name: string;
  measurement_unit_id: number;
}

export interface ProductWithPrice {
  product_code: number;
  product_name: string;
  measurement_unit_id: number;
  list_unit_price: number;
}

export interface MeasurementUnit {
  id: number;
  symbol: string;
  unit_name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface ClientOrder {
  order_id: number;
  client_id: number;
  ordered_at: string;
  order_city_id: number;
  order_status: String;
  payment_status: String;
  total_price: number;
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
}

export interface Product {
  product_code: number;
  product_name: string;
  measurement_unit_id: number;
}

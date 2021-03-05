import { API_URL } from "../../config";
import { simpleFetch } from "../../simpleFetch";

export class RetailManagerApi {
  static post<Result = unknown>(url: string, json: object) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "POST",
      json,
      credentials: "include",
    }).response.then((response) => response.json()) as Promise<Result>;
  }

  static get<Result = unknown>(url: string): Promise<Result> {
    return simpleFetch(`${API_URL}${url}`, {
      method: "GET",
      credentials: "include",
    }).response.then((response) => response.json()) as Promise<Result>;
  }

  static delete<Result = unknown>(url: string) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "DELETE",
      credentials: "include",
    }).response.then((response) => response.json()) as Promise<Result>;
  }

  static put<Result = unknown>(url: string, json: object) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "PUT",
      json,
      credentials: "include",
    }).response.then((response) => response.json()) as Promise<Result>;
  }
}

export interface ApiCustomerOrder {
  order_id: number;
  customer_id: number;
  ordered_at: string;
  order_city_id: number;
  order_status: string;
  payment_status: string;
  total_price: number;
  address: string | null;
}

import { API_URL } from "../../config";
import { simpleFetch } from "../../simpleFetch";

function parseIfJSON(response: Response) {
  if (response.headers.get("content-type") !== "application/json") {
    return response;
  }
  return response.json();
}

export class RetailManagerApi {
  static post<Result = unknown>(url: string, json: object) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "POST",
      json,
      credentials: "include",
    }).response.then(parseIfJSON) as Promise<Result>;
  }

  static get<Result = unknown>(url: string): Promise<Result> {
    return simpleFetch(`${API_URL}${url}`, {
      method: "GET",
      credentials: "include",
    }).response.then(parseIfJSON) as Promise<Result>;
  }

  static delete<Result = unknown>(url: string) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "DELETE",
      credentials: "include",
    }).response.then(parseIfJSON) as Promise<Result>;
  }

  static put<Result = unknown>(url: string, json: object) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "PUT",
      json,
      credentials: "include",
    }).response.then(parseIfJSON) as Promise<Result>;
  }
}

export interface ApiCustomerOrder {
  order_id: number;
  customer_id: number;
  ordered_at: string;
  order_city_id: number;
  order_status: string;
  total_price: number;
  address: string | null;
}

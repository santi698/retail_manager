import { API_URL } from "../../config";
import { simpleFetch } from "../../simpleFetch";

export class RetailManagerApi {
  static post<Result = any>(url: string, json: object) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "POST",
      json,
      credentials: "include",
    }).response.then((response) => response.json()) as Promise<Result>;
  }

  static get<Result = any>(url: string): Promise<Result> {
    return simpleFetch(`${API_URL}${url}`, {
      method: "GET",
      credentials: "include",
    }).response.then((response) => response.json()) as Promise<Result>;
  }

  static delete<Result = any>(url: string) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "DELETE",
      credentials: "include",
    }).response.then((response) => response.json()) as Promise<Result>;
  }

  static put<Result = any>(url: string, json: object) {
    return simpleFetch(`${API_URL}${url}`, {
      method: "PUT",
      json,
      credentials: "include",
    }).response.then((response) => response.json()) as Promise<Result>;
  }
}

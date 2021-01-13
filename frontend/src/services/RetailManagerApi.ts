import { simpleFetch } from "../simpleFetch";

export class RetailManagerApi {
  static post(url: string, json: object) {
    return simpleFetch(url, {
      method: "POST",
      json,
      credentials: "include",
    }).response;
  }

  static get(url: string) {
    return simpleFetch(url, {
      method: "GET",
      credentials: "include",
    }).response;
  }

  static delete(url: string) {
    return simpleFetch(url, {
      method: "DELETE",
      credentials: "include",
    }).response;
  }

  static put(url: string, json: object) {
    return simpleFetch(url, {
      method: "PUT",
      json,
      credentials: "include",
    }).response;
  }
}

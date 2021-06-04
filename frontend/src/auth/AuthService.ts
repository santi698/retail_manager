import { RetailManagerApi } from "../common/services/RetailManagerApi";
import { API_URL } from "../config";

export interface LogInValues {
  email: string;
  password: string;
}

export function logIn(values: LogInValues) {
  return fetch(`${API_URL}/auth/login`, {
    method: "post",
    body: new URLSearchParams(Object.entries(values)),
  });
}

export function logOut() {
  return RetailManagerApi.delete(`/auth/logout`);
}

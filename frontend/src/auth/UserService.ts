import { RetailManagerApi } from "../common/services/RetailManagerApi";

export interface User {
  id: number;
  account_id: number;
  first_name: string;
  last_name: string;
}

export function getCurrentUser() {
  return RetailManagerApi.get<User>("/auth/me");
}

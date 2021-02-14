import { RetailManagerApi } from "../common/services/RetailManagerApi";

export function getCurrentUser() {
  return RetailManagerApi.get("/auth/me");
}

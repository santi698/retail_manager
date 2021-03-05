import { useQuery } from "react-query";
import { getCustomers } from "./CustomersService";

export function useCustomers() {
  return useQuery("customers", () => getCustomers());
}

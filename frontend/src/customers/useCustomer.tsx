import { useQuery } from "react-query";
import { Customer } from "../domain/Customer";
import { getCustomer } from "./CustomersService";

export function useCustomer(id: number | undefined) {
  return useQuery<Customer>(
    ["customers", id],
    ({ queryKey }) => getCustomer(queryKey[1]),
    {
      enabled: id !== undefined,
    }
  );
}

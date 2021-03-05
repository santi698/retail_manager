import { useQueryClient } from "react-query";

export function useRefetchCustomers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries("customers");
  };
}

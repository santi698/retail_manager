import { useQueryClient } from "react-query";

export function useRefetchProducts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries("products");
  };
}

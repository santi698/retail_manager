import { useQueryClient } from "react-query";

export function useRefetchClients() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries("clients");
  };
}

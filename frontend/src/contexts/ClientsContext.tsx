import { makeLoadableContext } from "./LoadableContext";
import { Client } from "../model";
import { Loadable, Loading } from "../Loadable";
import { API_URL } from "../config";

const {
  Provider: ClientsProvider,
  useData: useClients,
  useRefetch: useRefetchClients,
} = makeLoadableContext<Client[]>({
  fetchUrl: `${API_URL}/api/clients`,
});

export { ClientsProvider, useClients, useRefetchClients };

export function useClient(id: number | undefined): Loadable<Client> {
  const loadable = useClients();

  if (id === undefined) return new Loading();

  return loadable.map<Client>((clients) => {
    const client = clients.find((client) => client.client_id === id);
    if (client === undefined) throw new Error(`Client with id ${id} not found`);
    return client;
  });
}

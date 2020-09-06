import { makeLoadableContext } from "./LoadableContext";
import { Client } from "../model";

const {
  Provider: ClientsProvider,
  useData: useClients,
  useRefetch: useRefetchClients,
} = makeLoadableContext<Client[]>({
  fetchUrl: "http://localhost:5000/clients",
});

export { ClientsProvider, useClients, useRefetchClients };

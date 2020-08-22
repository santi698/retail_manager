import { makeLoadableContext } from "./LoadableContext";
import { Client } from "../model";

const { Provider: ClientsProvider, useData: useClients } = makeLoadableContext<
  Client[]
>({
  fetchUrl: "http://localhost:5000/clients",
  refetchInterval: 60000,
});

export { ClientsProvider, useClients };

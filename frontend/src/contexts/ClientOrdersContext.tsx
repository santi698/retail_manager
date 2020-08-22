import { makeLoadableContext } from "./LoadableContext";
import { ClientOrder } from "../model";

const {
  Provider: ClientOrdersProvider,
  useData: useClientOrders,
} = makeLoadableContext<ClientOrder[]>({
  fetchUrl: "http://localhost:5000/client_orders",
  refetchInterval: 60000,
});

export { ClientOrdersProvider, useClientOrders };

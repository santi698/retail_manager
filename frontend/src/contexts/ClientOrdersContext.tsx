import { makeLoadableContext } from "./LoadableContext";
import { ClientOrder } from "../model";

const {
  Provider: ClientOrdersProvider,
  useData: useClientOrders,
} = makeLoadableContext<ClientOrder[]>({
  fetchUrl: "http://192.168.1.104:5000/api/client_orders",
});

export { ClientOrdersProvider, useClientOrders };

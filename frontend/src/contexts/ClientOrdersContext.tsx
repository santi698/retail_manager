import { makeLoadableContext } from "./LoadableContext";
import { ClientOrder } from "../model";
import { Loadable, Loading } from "../Loadable";

const {
  Provider: ClientOrdersProvider,
  useData: useClientOrders,
  useRefetch: useRefetchClientOrders,
} = makeLoadableContext<ClientOrder[]>({
  fetchUrl: "http://192.168.1.104:5000/api/client_orders",
});

export { ClientOrdersProvider, useClientOrders, useRefetchClientOrders };

export function useClientOrder(id: number | undefined): Loadable<ClientOrder> {
  const loadable = useClientOrders();

  if (id === undefined) return new Loading();

  return loadable.map<ClientOrder>((orders) => {
    const order = orders.find((order) => order.order_id === id);
    if (order === undefined) throw new Error(`Client with id ${id} not found`);
    return order;
  });
}

import { makeLoadableContext } from "./LoadableContext";
import { ClientOrder } from "../model";
import { Loadable, Loading } from "../Loadable";
import { API_URL } from "../config";

const {
  Provider: ClientOrdersProvider,
  useData: useClientOrders,
  useRefetch: useRefetchClientOrders,
} = makeLoadableContext<ClientOrder[]>({
  fetchUrl: `${API_URL}/api/client_orders`,
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

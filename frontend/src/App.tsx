import React, { useState, useEffect } from "react";

const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  currency: "ARS",
  style: "currency",
});

interface ClientOrder {
  order_id: number;
  client_id: number;
  ordered_at: string;
  order_city_id: number;
  order_status: String;
  payment_status: String;
  total_price: number;
}

interface ClientOrderItem {
  client_order_id: number;
  client_order_item_id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
}

interface Client {
  client_id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  residence_city_id: number;
}

interface Product {
  product_code: number;
  product_name: string;
  measurement_unit_id: number;
}

function useFetch<T>(url: string): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data: T) => setData(data));
  }, [url]);

  return data;
}

function useClientOrders() {
  return useFetch<ClientOrder[]>("http://localhost:5000/client_orders");
}

function useClientOrderItems(id: number) {
  return useFetch<ClientOrderItem[]>(
    `http://localhost:5000/client_orders/${id}/items`
  );
}

function useClients() {
  return useFetch<Client[]>("http://localhost:5000/clients");
}

function useProducts() {
  return useFetch<Product[]>("http://localhost:5000/products");
}

function Currency({ children }: { children: number }) {
  return <>{currencyFormatter.format(children)}</>;
}

function App() {
  const clientOrders = useClientOrders();
  const clients = useClients();
  return (
    <div>
      <h1>Pedidos</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Id. de pedido</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th className="currency">Total</th>
            <th>Estado del pago</th>
            <th>Estado del pedido</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {clientOrders?.map((order) => {
            const client = clients?.find(
              (client) => client.client_id === order.client_id
            );
            return (
              <tr key={order.order_id}>
                <td />
                <td>{order.order_id}</td>
                <td>
                  {order.ordered_at && Intl.DateTimeFormat().format(new Date())}
                </td>
                <td>
                  {client && (
                    <>
                      {client.first_name} {client.last_name}
                    </>
                  )}
                </td>
                <td className="currency">
                  {<Currency>{order.total_price}</Currency>}
                </td>
                <td>
                  <div className="badge">{order.payment_status}</div>
                </td>
                <td>
                  <div className="badge">{order.order_status}</div>
                </td>
                <td />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;

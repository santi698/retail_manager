import React from "react";
import { Currency } from "../components/Currency";
import { ClientOrder, Client } from "../model";
import { StatusBadge, ColorVariant } from "../components/StatusBadge";

export function OrderRow({
  order,
  client,
}: {
  order: ClientOrder;
  client: Client;
}) {
  return (
    <tr key={order.order_id}>
      <td />
      <td>{order.order_id}</td>
      <td>
        {order.ordered_at &&
          new Intl.DateTimeFormat(navigator.language, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date(order.ordered_at))}
      </td>
      <td>
        {client && (
          <>
            {client.first_name} {client.last_name}
          </>
        )}
      </td>
      <td>
        <StatusBadge colorVariant={ColorVariant.Purple}>
          {order.payment_status}
        </StatusBadge>
      </td>
      <td>
        <StatusBadge colorVariant={ColorVariant.Purple}>
          {order.order_status}
        </StatusBadge>
      </td>
      <td className="currency">{<Currency>{order.total_price}</Currency>}</td>
      <td />
    </tr>
  );
}

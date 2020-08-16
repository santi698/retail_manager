import React from "react";
import { Currency } from "../components/Currency";
import { ClientOrder, Client } from "../model";
import { StatusBadge, ColorVariant } from "../components/StatusBadge";
import { DateTime } from "../components/DateTime";
import { translatePaymentStatus } from "../translatePaymentStatus";
import { translateOrderStatus } from "../translateOrderStatus";

function orderStatusToColorVariant(status: string): ColorVariant {
  switch (status) {
    case "draft":
      return ColorVariant.Purple;
    case "confirmed":
      return ColorVariant.Green;
    case "cancelled":
      return ColorVariant.Red;
    case "delivered":
      return ColorVariant.Blue;
    default:
      return ColorVariant.Yellow;
  }
}

export function OrderRow({
  order,
  client,
}: {
  order: ClientOrder;
  client: Client;
}) {
  return (
    <tr>
      <td />
      <td>{order.order_id}</td>
      <td>
        {order.ordered_at && <DateTime>{new Date(order.ordered_at)}</DateTime>}
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
          {translatePaymentStatus(order.payment_status)}
        </StatusBadge>
      </td>
      <td>
        <StatusBadge
          colorVariant={orderStatusToColorVariant(order.order_status)}
        >
          {translateOrderStatus(order.order_status)}
        </StatusBadge>
      </td>
      <td className="currency">{<Currency>{order.total_price}</Currency>}</td>
      <td />
    </tr>
  );
}

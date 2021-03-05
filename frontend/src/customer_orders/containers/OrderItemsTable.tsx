import React from "react";
import { CustomerOrderItem } from "../CustomerOrderItem";
import { OrderItemRow } from "./OrderItemRow";
import { Table } from "../../common/components/Table";

export function OrderItemsTable({ items }: { items: CustomerOrderItem[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Cod.</th>
          <th>Nombre</th>
          <th>Precio unitario</th>
          <th>Cantidad</th>
          <th>Precio de venta</th>
          <th>Descuento</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <OrderItemRow item={item} key={item.customer_order_item_id} />
        ))}
      </tbody>
    </Table>
  );
}

import React from "react";
import { ClientOrderItem } from "../model";
import { OrderItemRow } from "./OrderItemRow";
import { Table } from "../components/Table";

export function OrderItemsTable({ items }: { items: ClientOrderItem[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Cod.</th>
          <th>Nombre</th>
          <th>Precio unitario</th>
          <th>Cantidad</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item) => (
          <OrderItemRow item={item} />
        ))}
      </tbody>
    </Table>
  );
}

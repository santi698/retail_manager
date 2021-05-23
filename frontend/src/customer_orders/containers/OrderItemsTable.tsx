import React from "react";
import { Tbody, Th, Thead, Tr, Table } from "@chakra-ui/table";
import { CustomerOrderItem } from "../CustomerOrderItem";
import { OrderItemRow } from "./OrderItemRow";

export function OrderItemsTable({ items }: { items: CustomerOrderItem[] }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Cod.</Th>
          <Th>Nombre</Th>
          <Th>Precio unitario</Th>
          <Th>Cantidad</Th>
          <Th>Precio de venta</Th>
          <Th>Descuento</Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.map((item) => (
          <OrderItemRow item={item} key={item.customer_order_item_id} />
        ))}
      </Tbody>
    </Table>
  );
}

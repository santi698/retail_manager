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
          <Th isNumeric>Precio unitario</Th>
          <Th isNumeric>Cantidad</Th>
          <Th isNumeric>Precio de venta</Th>
          <Th isNumeric>Descuento</Th>
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

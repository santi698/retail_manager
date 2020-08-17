import React from "react";
import { ClientOrderItem } from "../model";
import { useProduct } from "../hooks/useProduct";
import { Currency } from "../components/Currency";

export function OrderItemRow({ item }: { item: ClientOrderItem }) {
  const product = useProduct(item.product_id);
  return (
    <tr>
      <td />
      <td>{product?.product_code}</td>
      <td style={{ width: "24em" }}>{product?.product_name}</td>
      <td>?</td>
      <td>{item.quantity}</td>
      <td className="currency">
        <Currency>{item.selling_price}</Currency>
      </td>
    </tr>
  );
}

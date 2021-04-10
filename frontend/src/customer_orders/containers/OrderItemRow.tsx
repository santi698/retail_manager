import React from "react";
import { CustomerOrderItem } from "../CustomerOrderItem";
import { Currency } from "../../common/components/Currency";
import { Number } from "../../common/components/Number";
import { Percentage } from "../../common/components/Percentage";
import { useMeasurementUnits } from "../../products/hooks/useMeasurementUnits";
import { useProduct } from "../../products/hooks/useProduct";

export function OrderItemRow({ item }: { item: CustomerOrderItem }) {
  const loadingMeasurementUnits = useMeasurementUnits();
  const loadingProduct = useProduct(item.product_id);
  if (
    loadingProduct.status !== "success" ||
    loadingMeasurementUnits.status !== "success"
  ) {
    return null;
  }
  const measurementUnits = loadingMeasurementUnits.data;
  const product = loadingProduct.data;
  const measurementUnit = measurementUnits.find(
    (u) => u.id === product.measurement_unit_id
  );
  if (measurementUnit === undefined) {
    throw new Error("Error finding measurement unit");
  }
  const normalPrice = product.list_unit_price * item.quantity;
  const priceDifference = normalPrice - item.selling_price;
  return (
    <tr>
      <td>{product.product_code}</td>
      <td style={{ width: "16em" }}>{product.product_name}</td>
      <td>
        <Currency>{product.list_unit_price}</Currency>
      </td>
      <td>
        <Number>{item.quantity}</Number> {measurementUnit.symbol}
      </td>
      <td className="currency">
        <Currency>{item.selling_price}</Currency>
        {priceDifference !== 0 && (
          <>
            {" "}
            /{" "}
            <span style={{ textDecoration: "line-through" }}>
              <Currency>{normalPrice}</Currency>
            </span>
          </>
        )}
      </td>
      <td>
        <Percentage>{priceDifference / normalPrice}</Percentage>
      </td>
    </tr>
  );
}

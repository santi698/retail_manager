import React from "react";
import { ClientOrderItem } from "../model";
import { useProduct } from "../hooks/useProduct";
import { Currency } from "../components/Currency";
import { useMeasurementUnits } from "../hooks/useMeasurementUnits";
import { Number } from "../components/Number";
import { Percentage } from "../components/Percentage";

export function OrderItemRow({ item }: { item: ClientOrderItem }) {
  const { data: loadingMeasurementUnits } = useMeasurementUnits();
  const { data: loadingProduct } = useProduct(item.product_id);
  if (
    loadingProduct.status !== "loaded" ||
    loadingMeasurementUnits.status !== "loaded"
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
      <td />
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
        {priceDifference > 0 && (
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
        <Percentage>
          {(normalPrice - item.selling_price) / normalPrice}
        </Percentage>
      </td>
    </tr>
  );
}

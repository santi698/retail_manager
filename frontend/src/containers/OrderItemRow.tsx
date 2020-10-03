import React from "react";
import { ClientOrderItem } from "../model";
import { Currency } from "../components/Currency";
import { Number } from "../components/Number";
import { Percentage } from "../components/Percentage";
import { useProduct } from "../contexts/ProductsContext";
import { useMeasurementUnits } from "../contexts/MeasurementUnitsContext";

export function OrderItemRow({ item }: { item: ClientOrderItem }) {
  const loadingMeasurementUnits = useMeasurementUnits();
  const loadingProduct = useProduct(item.product_id);
  if (
    loadingProduct.state !== "loaded" ||
    loadingMeasurementUnits.state !== "loaded"
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

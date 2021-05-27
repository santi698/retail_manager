import React from "react";
import { Td, Tr } from "@chakra-ui/table";
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
    <Tr>
      <Td>{product.product_code}</Td>
      <Td style={{ width: "16em" }}>{product.product_name}</Td>
      <Td isNumeric>
        <Currency>{product.list_unit_price}</Currency>
      </Td>
      <Td isNumeric>
        <Number>{item.quantity}</Number> {measurementUnit.symbol}
      </Td>
      <Td isNumeric>
        {priceDifference !== 0 && (
          <>
            <span style={{ textDecoration: "line-through" }}>
              <Currency>{normalPrice}</Currency>
            </span>
          </>
        )}{" "}
        <Currency>{item.selling_price}</Currency>
      </Td>
      <Td isNumeric>
        <Percentage>{priceDifference / normalPrice}</Percentage>
      </Td>
    </Tr>
  );
}

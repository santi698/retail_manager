import { ColorVariant } from "../common/components/StatusBadge";
import { OrderStatusValue } from "./OrderStatus";

export function orderStatusToColorVariant(
  status: OrderStatusValue
): ColorVariant {
  switch (status) {
    case "draft":
      return ColorVariant.Purple;
    case "confirmed":
      return ColorVariant.Green;
    case "canceled":
      return ColorVariant.Red;
    case "delivered":
      return ColorVariant.Blue;
    default:
      return ColorVariant.Yellow;
  }
}

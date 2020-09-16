import { ClientOrderStatus } from "./model";
import { ColorVariant } from "./components/StatusBadge";

export function orderStatusToColorVariant(
  status: ClientOrderStatus
): ColorVariant {
  switch (status) {
    case "draft":
      return ColorVariant.Purple;
    case "confirmed":
      return ColorVariant.Green;
    case "cancelled":
      return ColorVariant.Red;
    case "delivered":
      return ColorVariant.Blue;
    default:
      return ColorVariant.Yellow;
  }
}

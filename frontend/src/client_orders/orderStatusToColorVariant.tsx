import { ClientOrderStatus } from "../domain/ClientOrder";
import { ColorVariant } from "../common/components/StatusBadge";

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

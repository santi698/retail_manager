import { ClientOrderPaymentStatus } from "../domain/ClientOrder";
import { ColorVariant } from "../common/components/StatusBadge";

export function paymentStatusToColorVariant(
  status: ClientOrderPaymentStatus
): ColorVariant {
  switch (status) {
    case "pending":
      return ColorVariant.Purple;
    case "paid":
      return ColorVariant.Green;
    case "cancelled":
      return ColorVariant.Red;
    default:
      return ColorVariant.Yellow;
  }
}

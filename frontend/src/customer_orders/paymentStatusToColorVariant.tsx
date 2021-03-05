import { ColorVariant } from "../common/components/StatusBadge";
import { PaymentStatusValue } from "./PaymentStatus";

export function paymentStatusToColorVariant(
  status: PaymentStatusValue
): ColorVariant {
  switch (status) {
    case "pending":
      return ColorVariant.Purple;
    case "collected":
      return ColorVariant.Green;
    case "canceled":
      return ColorVariant.Red;
    default:
      return ColorVariant.Yellow;
  }
}

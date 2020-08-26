import { ClientOrderPaymentStatus } from "./model";

export function translatePaymentStatus(
  status: ClientOrderPaymentStatus
): string {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "paid":
      return "Pagado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

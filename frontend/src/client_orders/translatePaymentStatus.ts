import { ClientOrderPaymentStatus } from "../domain/ClientOrder";

export function translatePaymentStatus(
  status: ClientOrderPaymentStatus
): string {
  switch (status.toLocaleLowerCase()) {
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

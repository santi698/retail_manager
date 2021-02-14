import { ClientOrderStatus } from "../domain/ClientOrder";

export function translateOrderStatus(status: ClientOrderStatus): string {
  switch (status.toLocaleLowerCase()) {
    case "draft":
      return "Borrador";
    case "confirmed":
      return "Confirmado";
    case "cancelled":
      return "Cancelado";
    case "delivered":
      return "Entregado";
    default:
      return status;
  }
}

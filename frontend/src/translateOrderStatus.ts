export function translateOrderStatus(status: string) {
  switch (status) {
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

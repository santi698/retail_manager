export function translatePaymentStatus(status: string) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "paid":
      return "Pagado";
  }
}

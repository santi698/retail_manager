import { Failure, Result, Success } from "../common/types/Result";

export type OrderStatusValue =
  | "draft"
  | "confirmed"
  | "cancelled"
  | "delivered";
export class OrderStatus {
  private constructor(private value: OrderStatusValue) {
    this.value = value;
  }

  static parse(value: string): Result<OrderStatus, Error> {
    if (!["draft", "confirmed", "cancelled", "delivered"].includes(value)) {
      return new Failure(new Error(`Invalid value ${value} for OrderStatus`));
    }

    return new Success(new OrderStatus(value as OrderStatusValue));
  }

  toString() {
    return this.value;
  }

  translate() {
    switch (this.value) {
      case "draft":
        return "Borrador";
      case "confirmed":
        return "Confirmado";
      case "cancelled":
        return "Cancelado";
      case "delivered":
        return "Entregado";
      default:
        return this.value;
    }
  }
}

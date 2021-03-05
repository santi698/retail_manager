import { ColorVariant } from "../common/components/StatusBadge";

export enum OrderStatusValue {
  Draft = "draft",
  Confirmed = "confirmed",
  Delivered = "delivered",
  Canceled = "canceled",
}

const LABELS: Record<OrderStatusValue, string> = {
  [OrderStatusValue.Draft]: "Borrador",
  [OrderStatusValue.Confirmed]: "Confirmado",
  [OrderStatusValue.Delivered]: "Entregado",
  [OrderStatusValue.Canceled]: "Cancelado",
};

export class OrderStatus {
  private constructor(public value: OrderStatusValue) {
    this.value = value;
  }
  static from(value: string): OrderStatus {
    switch (value) {
      case "draft": {
        return new OrderStatus(OrderStatusValue.Draft);
      }
      case "confirmed": {
        return new OrderStatus(OrderStatusValue.Confirmed);
      }
      case "delivered": {
        return new OrderStatus(OrderStatusValue.Delivered);
      }
      case "canceled": {
        return new OrderStatus(OrderStatusValue.Canceled);
      }
      default:
        throw new Error(`Invalid order status ${value}`);
    }
  }

  toJSON() {
    return this.value;
  }

  label() {
    return LABELS[this.value];
  }

  validTransitions(): OrderStatus[] {
    switch (this.value) {
      case OrderStatusValue.Draft: {
        return [
          new OrderStatus(OrderStatusValue.Confirmed),
          new OrderStatus(OrderStatusValue.Canceled),
        ];
      }
      case OrderStatusValue.Confirmed: {
        return [
          new OrderStatus(OrderStatusValue.Delivered),
          new OrderStatus(OrderStatusValue.Canceled),
        ];
      }
      case OrderStatusValue.Delivered:
      case OrderStatusValue.Canceled: {
        return [];
      }
    }
  }

  colorVariant(): ColorVariant {
    switch (this.value) {
      case OrderStatusValue.Draft: {
        return ColorVariant.Gray;
      }
      case OrderStatusValue.Confirmed: {
        return ColorVariant.Blue;
      }
      case OrderStatusValue.Delivered: {
        return ColorVariant.Green;
      }
      case OrderStatusValue.Canceled: {
        return ColorVariant.Pink;
      }
    }
  }
}

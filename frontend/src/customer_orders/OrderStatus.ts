import { ColorVariant } from "../common/components/StatusBadge";

export enum OrderStatusValue {
  Draft = "draft",
  Confirmed = "confirmed",
  PartiallyPaid = "partially_paid",
  Paid = "paid",
  InTransit = "in_transit",
  Delivered = "delivered",
  Canceled = "canceled",
}

const LABELS: Record<OrderStatusValue, string> = {
  [OrderStatusValue.Draft]: "Borrador",
  [OrderStatusValue.Confirmed]: "Confirmado",
  [OrderStatusValue.PartiallyPaid]: "Pago parcial",
  [OrderStatusValue.Paid]: "Pagado",
  [OrderStatusValue.InTransit]: "En tránsito",
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
      case "partially_paid": {
        return new OrderStatus(OrderStatusValue.PartiallyPaid);
      }
      case "paid": {
        return new OrderStatus(OrderStatusValue.Paid);
      }
      case "in_transit": {
        return new OrderStatus(OrderStatusValue.InTransit);
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

  isEditable() {
    if (
      [OrderStatusValue.Draft, OrderStatusValue.Confirmed].includes(this.value)
    ) {
      return true;
    }
    return false;
  }

  isFinished() {
    if (
      [OrderStatusValue.Delivered, OrderStatusValue.Canceled].includes(
        this.value
      )
    ) {
      return true;
    }
    return false;
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
          new OrderStatus(OrderStatusValue.InTransit),
          new OrderStatus(OrderStatusValue.Delivered),
          new OrderStatus(OrderStatusValue.Paid),
          new OrderStatus(OrderStatusValue.PartiallyPaid),
          new OrderStatus(OrderStatusValue.Canceled),
        ];
      }
      case OrderStatusValue.PartiallyPaid: {
        return [
          new OrderStatus(OrderStatusValue.InTransit),
          new OrderStatus(OrderStatusValue.Paid),
          new OrderStatus(OrderStatusValue.Delivered),
        ];
      }
      case OrderStatusValue.Paid: {
        return [
          new OrderStatus(OrderStatusValue.Delivered),
          new OrderStatus(OrderStatusValue.Canceled),
        ];
      }
      case OrderStatusValue.InTransit: {
        return [
          new OrderStatus(OrderStatusValue.Delivered),
          new OrderStatus(OrderStatusValue.Confirmed),
          new OrderStatus(OrderStatusValue.Paid),
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
      case OrderStatusValue.PartiallyPaid: {
        return ColorVariant.Teal;
      }
      case OrderStatusValue.Paid: {
        return ColorVariant.Cyan;
      }
      case OrderStatusValue.InTransit: {
        return ColorVariant.Yellow;
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

import { ColorVariant } from "../common/components/StatusBadge";

export enum PaymentStatusValue {
  Pending = "pending",
  Collected = "collected",
  Canceled = "canceled",
}

const LABELS: Record<PaymentStatusValue, string> = {
  [PaymentStatusValue.Pending]: "Pendiente",
  [PaymentStatusValue.Collected]: "Cobrado",
  [PaymentStatusValue.Canceled]: "Cancelado",
};

export class PaymentStatus {
  constructor(public value: PaymentStatusValue) {
    this.value = value;
  }
  static from(value: string): PaymentStatus {
    switch (value) {
      case "pending": {
        return new PaymentStatus(PaymentStatusValue.Pending);
      }
      case "collected": {
        return new PaymentStatus(PaymentStatusValue.Collected);
      }
      case "canceled": {
        return new PaymentStatus(PaymentStatusValue.Canceled);
      }
      default:
        throw new Error(`Invalid payment status ${value}`);
    }
  }

  toJSON() {
    return this.value;
  }

  label() {
    return LABELS[this.value];
  }

  validTransitions(): PaymentStatus[] {
    switch (this.value) {
      case PaymentStatusValue.Pending: {
        return [
          new PaymentStatus(PaymentStatusValue.Collected),
          new PaymentStatus(PaymentStatusValue.Canceled),
        ];
      }
      case PaymentStatusValue.Collected:
      case PaymentStatusValue.Canceled: {
        return [];
      }
    }
  }

  colorVariant(): ColorVariant {
    switch (this.value) {
      case PaymentStatusValue.Pending: {
        return ColorVariant.Gray;
      }
      case PaymentStatusValue.Collected: {
        return ColorVariant.Green;
      }
      case PaymentStatusValue.Canceled: {
        return ColorVariant.Pink;
      }
    }
  }
}

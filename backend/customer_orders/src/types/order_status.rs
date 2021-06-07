use std::convert::TryFrom;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
#[serde(rename_all = "snake_case")]
#[sqlx(rename = "VARCHAR")]
#[sqlx(rename_all = "snake_case")]
pub enum OrderStatus {
    Draft,
    Confirmed,
    PartiallyPaid,
    Paid,
    InTransit,
    Delivered,
    Canceled,
}

impl TryFrom<String> for OrderStatus {
    type Error = String;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.as_str() {
            "draft" => Ok(Self::Draft),
            "confirmed" => Ok(Self::Confirmed),
            "partially_paid" => Ok(Self::PartiallyPaid),
            "paid" => Ok(Self::Paid),
            "in_transit" => Ok(Self::InTransit),
            "delivered" => Ok(Self::Delivered),
            "canceled" => Ok(Self::Canceled),
            _ => Err(format!("Invalid order status {}", value)),
        }
    }
}

impl AsRef<str> for OrderStatus {
    fn as_ref(&self) -> &str {
        match self {
            OrderStatus::Draft => "draft",
            OrderStatus::Confirmed => "confirmed",
            OrderStatus::PartiallyPaid => "partially_paid",
            OrderStatus::Paid => "paid",
            OrderStatus::InTransit => "in_transit",
            OrderStatus::Delivered => "delivered",
            OrderStatus::Canceled => "canceled",
        }
    }
}

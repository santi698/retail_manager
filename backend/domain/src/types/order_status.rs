use std::convert::TryFrom;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
#[serde(rename_all = "snake_case")]
#[sqlx(rename = "VARCHAR")]
#[sqlx(rename_all = "snake_case")]
pub enum OrderStatus {
    Draft,
    Confirmed,
    Paid,
    Delivered,
    Canceled,
}

impl TryFrom<String> for OrderStatus {
    type Error = String;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.as_str() {
            "draft" => Ok(Self::Draft),
            "confirmed" => Ok(Self::Confirmed),
            "paid" => Ok(Self::Paid),
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
            OrderStatus::Paid => "paid",
            OrderStatus::Delivered => "delivered",
            OrderStatus::Canceled => "canceled",
        }
    }
}

use std::convert::TryFrom;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
#[sqlx(rename_all = "lowercase")]
pub enum OrderStatus {
    Draft,
    Confirmed,
    Delivered,
    Canceled,
}

impl TryFrom<String> for OrderStatus {
    type Error = String;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.as_str() {
            "draft" => Ok(Self::Draft),
            "confirmed" => Ok(Self::Confirmed),
            "delivered" => Ok(Self::Delivered),
            "Canceled" => Ok(Self::Canceled),
            _ => Err(format!("Invalid order status {}", value)),
        }
    }
}

impl AsRef<str> for OrderStatus {
    fn as_ref(&self) -> &str {
        match self {
            OrderStatus::Draft => "draft",
            OrderStatus::Confirmed => "confirmed",
            OrderStatus::Delivered => "delivered",
            OrderStatus::Canceled => "canceled",
        }
    }
}

use std::convert::TryFrom;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
#[sqlx(rename = "VARCHAR")]
#[sqlx(rename_all = "lowercase")]
pub enum PaymentStatus {
    Pending,
    Collected,
    Canceled,
}

impl TryFrom<String> for PaymentStatus {
    type Error = String;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.as_str() {
            "pending" => Ok(Self::Pending),
            "collected" => Ok(Self::Collected),
            "canceled" => Ok(Self::Canceled),
            _ => Err(format!("Invalid order status {}", value)),
        }
    }
}

impl AsRef<str> for PaymentStatus {
    fn as_ref(&self) -> &str {
        match self {
            PaymentStatus::Pending => "pending",
            PaymentStatus::Collected => "collected",
            PaymentStatus::Canceled => "canceled",
        }
    }
}

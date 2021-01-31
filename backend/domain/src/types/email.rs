use std::convert::TryFrom;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
pub struct Email(String);

impl TryFrom<String> for Email {
    type Error = String;

    fn try_from(s: String) -> Result<Self, Self::Error> {
        Ok(Email(s))
    }
}

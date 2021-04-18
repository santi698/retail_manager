use std::convert::TryFrom;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(transparent)]
pub struct Email(String);

impl TryFrom<String> for Email {
    type Error = String;

    fn try_from(s: String) -> Result<Self, Self::Error> {
        Ok(Email(s))
    }
}

impl Into<String> for Email {
    fn into(self) -> String {
        self.0
    }
}

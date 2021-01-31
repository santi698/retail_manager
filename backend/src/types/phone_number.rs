use regex::Regex;
use serde::{Deserialize, Serialize};

lazy_static! {
    static ref VALIDATION_RE: Regex = Regex::new(r"(\d[\-. ]?){7}\d").unwrap();
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
pub struct PhoneNumber(String);

impl TryFrom<String> for PhoneNumber {
    type Error = ValidationError;

    fn try_from(s: String) -> Result<Self, Self::Error> {
        if VALIDATION_RE.is_match(&s) {
            Ok(PhoneNumber(s.trim().to_string()))
        } else {
            Err(ValidationError::new(
                "PhoneNumber",
                "0",
                "Invalid Phone number",
            ))
        }
    }
}

use std::{convert::TryFrom, fmt::Display};

use super::ValidationError;
impl Display for PhoneNumber {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

use regex::Regex;
use serde::{Deserialize, Serialize};

lazy_static! {
    static ref VALIDATION_RE: Regex = Regex::new(r"(\d[\-. ]?){7}\d").unwrap();
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PhoneNumber(String);

use std::str::FromStr;
impl FromStr for PhoneNumber {
    type Err = ValidationError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if VALIDATION_RE.is_match(s) {
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

use std::ops::Deref;
impl Deref for PhoneNumber {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

use std::fmt::Display;

use super::ValidationError;
impl Display for PhoneNumber {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorJson {
    pub error: String,
}

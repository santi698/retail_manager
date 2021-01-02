use std::error;

#[derive(Debug)]
pub struct ValidationError {
    pub struct_name: String,
    pub field_name: String,
    pub error_message: String,
}

impl ValidationError {
    pub fn new(struct_name: &str, field_name: &str, error_message: &str) -> Self {
        Self {
            struct_name: struct_name.to_string(),
            field_name: field_name.to_string(),
            error_message: error_message.to_string(),
        }
    }
}

impl std::fmt::Display for ValidationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "ValidationError(field: {}##{}, message: {})",
            self.struct_name, self.field_name, self.error_message
        )
    }
}

impl error::Error for ValidationError {}

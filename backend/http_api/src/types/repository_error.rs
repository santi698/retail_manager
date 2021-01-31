use std::error;

#[derive(Debug)]
#[non_exhaustive]
pub enum RepositoryError {
    ConnectionError(Box<dyn error::Error>),
    MappingError(Box<dyn error::Error>),
    NotFound(String),
    Unknown(Box<dyn error::Error>),
}

use std::fmt::Display;
impl Display for RepositoryError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::ConnectionError(e) => write!(f, "Connection error {}", e),
            Self::MappingError(e) => write!(f, "MappingError: {}", e),
            Self::NotFound(s) => write!(f, "Record {} not found", s),
            Self::Unknown(e) => write!(f, "Unknown error: {}", e),
        }
    }
}

impl error::Error for RepositoryError {
    fn source(&self) -> Option<&(dyn error::Error + 'static)> {
        match self {
            RepositoryError::ConnectionError(e) => Some(e.as_ref()),
            RepositoryError::MappingError(e) => Some(e.as_ref()),
            RepositoryError::NotFound(_) => None,
            RepositoryError::Unknown(e) => Some(e.as_ref()),
        }
    }
}

impl From<sqlx::error::Error> for RepositoryError {
    fn from(error: sqlx::Error) -> Self {
        match error {
            sqlx::Error::ColumnIndexOutOfBounds { len: _, index: _ }
            | sqlx::Error::ColumnNotFound(_)
            | sqlx::Error::Decode(_) => Self::MappingError(error.into()),

            sqlx::Error::PoolTimedOut | sqlx::Error::PoolClosed | sqlx::Error::Io(_) => {
                Self::ConnectionError(error.into())
            }

            sqlx::Error::Database(_) | sqlx::Error::Protocol(_) | sqlx::Error::Tls(_) => {
                Self::Unknown(error.into())
            }
            sqlx::Error::RowNotFound => Self::NotFound(error.to_string()),
            _ => Self::Unknown(error.into()),
        }
    }
}

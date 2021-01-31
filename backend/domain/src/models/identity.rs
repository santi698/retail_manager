use async_trait::async_trait;
use serde::Serialize;

use crate::crypto::compare;

#[derive(Debug, Serialize)]
pub struct EmailAndPasswordIdentity {
    pub id: i32,
    pub email: String,
    pub password_hash: String,
    pub user_id: i32,
}

impl EmailAndPasswordIdentity {
    pub fn verify(&self, password: &str) -> bool {
        compare(&password, &self.password_hash)
    }
}

#[async_trait]
pub trait EmailAndPasswordIdentityRepository {
    type Error;

    async fn find_by_email(&self, email: &str) -> Result<EmailAndPasswordIdentity, Self::Error>;
}

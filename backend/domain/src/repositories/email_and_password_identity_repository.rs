use async_trait::async_trait;
use sqlx::{postgres::PgRow, PgPool, Row};

use crate::{EmailAndPasswordIdentity, EmailAndPasswordIdentityRepository, RepositoryError};

#[derive(Debug)]
pub struct PostgresEmailAndPasswordIdentityRepository {
    pool: PgPool,
}

impl PostgresEmailAndPasswordIdentityRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl EmailAndPasswordIdentityRepository for PostgresEmailAndPasswordIdentityRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "identity_repository.find_by_email", skip(self))]
    async fn find_by_email(&self, email: &str) -> Result<EmailAndPasswordIdentity, Self::Error> {
        let identity = sqlx::query(
            r#"
              SELECT * FROM email_and_password_identities WHERE email = $1
            "#,
        )
        .bind(email)
        .map(|r: PgRow| EmailAndPasswordIdentity {
            id: r.get("id"),
            email: r.get("email"),
            password_hash: r.get("password_hash"),
            user_id: r.get("user_id"),
        })
        .fetch_one(&self.pool)
        .await?;

        Ok(identity)
    }
}

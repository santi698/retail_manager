use async_trait::async_trait;
use sqlx::{postgres::PgRow, PgPool, Row};

use crate::{RepositoryError, User, UserRepository};

#[derive(Debug)]
pub struct PostgresUserRepository {
    pool: PgPool,
}

impl PostgresUserRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl UserRepository for PostgresUserRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "user_repository.find_by_id", skip(self))]
    async fn find_by_id(&self, id: i32) -> Result<User, Self::Error> {
        let user = sqlx::query(
            r#"
          SELECT * FROM users WHERE id = $1
          "#,
        )
        .bind(id)
        .map(|row: PgRow| User {
            id: row.get("id"),
            account_id: row.get("account_id"),
            first_name: row.get("first_name"),
            last_name: row.get("last_name"),
        })
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }
}

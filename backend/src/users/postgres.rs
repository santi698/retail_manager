use sqlx::{postgres::PgRow, PgPool, Row};

use super::{User, UserRepository};

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
    async fn find_by_id(&self, id: i32) -> anyhow::Result<User> {
        let user = sqlx::query(
            r#"
          SELECT * FROM users WHERE id = $1
          "#,
        )
        .bind(id)
        .map(|row: PgRow| User {
            id: row.get("id"),
            first_name: row.get("first_name"),
            last_name: row.get("last_name"),
        })
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }
}

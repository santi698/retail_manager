use async_trait::async_trait;
use sqlx::{postgres::PgRow, PgPool, Row};

use crate::{AccountSettings, AccountSettingsRepository, RepositoryError};

pub struct PostgresAccountSettingsRepository {
    pool: PgPool,
}

impl PostgresAccountSettingsRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl AccountSettingsRepository for PostgresAccountSettingsRepository {
    type Error = RepositoryError;

    async fn find_by_account_id(&self, account_id: i32) -> Result<AccountSettings, Self::Error> {
        let settings = sqlx::query(
            r#"
              SELECT * FROM account_settings WHERE account_id = $1
            "#,
        )
        .bind(account_id)
        .map(account_settings_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(settings)
    }

    async fn set_by_account_id(
        &self,
        account_id: i32,
        new_settings: &AccountSettings,
    ) -> Result<AccountSettings, Self::Error> {
        let settings = sqlx::query(
            r#"
                 UPDATE account_settings
                  WHERE account_id = $1
                    SET has_stock_non_negative_invariant = $1
              RETURNING *;
            "#,
        )
        .bind(account_id)
        .bind(new_settings.has_stock_non_negative_invariant)
        .map(account_settings_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(settings)
    }
}

fn account_settings_from_row(row: PgRow) -> AccountSettings {
    AccountSettings {
        account_id: row.get("account_id"),
        has_stock_non_negative_invariant: row.get("has_stock_non_negative_invariant"),
    }
}

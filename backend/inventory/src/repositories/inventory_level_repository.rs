use async_trait::async_trait;
use domain::RepositoryError;
use sqlx::{postgres::PgRow, Executor, PgPool, Postgres, Row};

use crate::{
    ChangeInventoryLevelRequest, FindInventoryLevelsRequest, InventoryLevel,
    InventoryLevelRepository,
};

pub struct PostgresInventoryLevelRepository {
    pool: PgPool,
}

impl PostgresInventoryLevelRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl InventoryLevelRepository for PostgresInventoryLevelRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "inventory_level_repository.current_level", skip(self))]
    async fn current_level(
        &self,
        account_id: i32,
        product_code: i32,
    ) -> Result<InventoryLevel, Self::Error> {
        let level = fetch_current_level(account_id, product_code, &self.pool).await?;
        match level {
            Some(level) => Ok(level),
            None => Ok(InventoryLevel::zero(account_id, product_code)),
        }
    }

    #[tracing::instrument(name = "inventory_level_repository.find_levels", skip(self))]
    async fn find_levels(
        &self,
        account_id: i32,
        request: FindInventoryLevelsRequest,
    ) -> Result<Vec<InventoryLevel>, Self::Error> {
        Ok(fetch_find_levels(account_id, request, &self.pool).await?)
    }

    #[tracing::instrument(name = "inventory_level_repository.change_level", skip(self))]
    async fn change_level(
        &self,
        account_id: i32,
        request: ChangeInventoryLevelRequest,
    ) -> Result<InventoryLevel, Self::Error> {
        let mut tx = self.pool.begin().await?;
        let previous_value = fetch_current_level(account_id, request.product_code, &mut tx).await?;
        let new_level = match previous_value {
            Some(previous_level) => previous_level.current_level + request.level_change,
            None => return Ok(InventoryLevel::zero(account_id, request.product_code)),
        };

        if new_level < 0f64 {
            return Err(RepositoryError::FailedInvariant {
                code: "IL-1".to_string(),
                message: "Inventory level would go below zero".to_string(),
            });
        }

        let level = sqlx::query(
            r#"
              INSERT INTO inventory_levels(
                account_id, product_code, timestamp, level_change, reason, current_level
              )
              VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5)
              RETURNING inventory_levels.*
            "#,
        )
        .bind(account_id)
        .bind(request.product_code)
        .bind(request.level_change)
        .bind(request.reason)
        .bind(new_level)
        .map(inventory_level_from_row)
        .fetch_one(&mut tx)
        .await?;

        tx.commit().await?;

        Ok(level)
    }
}

fn inventory_level_from_row(row: PgRow) -> InventoryLevel {
    InventoryLevel {
        id: row.get("id"),
        account_id: row.get("account_id"),
        current_level: row.get("current_level"),
        product_code: row.get("product_code"),
        timestamp: row.get("timestamp"),
        level_change: row.get("level_change"),
        reason: row.get("reason"),
    }
}

async fn fetch_current_level<'a, E>(
    account_id: i32,
    product_code: i32,
    executor: E,
) -> Result<Option<InventoryLevel>, RepositoryError>
where
    E: Executor<'a, Database = Postgres>,
{
    let level = sqlx::query(
        r#"
          SELECT * FROM inventory_levels
           WHERE account_id = $1
             AND product_code = $2
           ORDER BY timestamp DESC
           LIMIT 1;
        "#,
    )
    .bind(account_id)
    .bind(product_code)
    .map(inventory_level_from_row)
    .fetch_optional(executor)
    .await?;

    Ok(level)
}

async fn fetch_find_levels<'a, E>(
    account_id: i32,
    request: FindInventoryLevelsRequest,
    executor: E,
) -> Result<Vec<InventoryLevel>, RepositoryError>
where
    E: Executor<'a, Database = Postgres>,
{
    let levels = sqlx::query(
        r#"
              SELECT * FROM inventory_levels
               WHERE account_id = $1
                 AND product_code = $2
                 AND timestamp BETWEEN $3 and $4
               ORDER BY timestamp DESC
            "#,
    )
    .bind(account_id)
    .bind(request.product_code)
    .bind(request.from_date)
    .bind(request.to_date)
    .map(inventory_level_from_row)
    .fetch_all(executor)
    .await?;

    Ok(levels)
}

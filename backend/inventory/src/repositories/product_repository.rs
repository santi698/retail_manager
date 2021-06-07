use async_trait::async_trait;
use sqlx::postgres::{PgDone, PgPool, PgRow};
use sqlx::{Done, Row};

use domain::RepositoryError;

use crate::{Product, ProductCreateRequest, ProductRepository, ProductUpdateRequest};

fn product_from_row(row: PgRow) -> Product {
    Product {
        account_id: row.get("account_id"),
        product_code: row.get("product_code"),
        product_name: row.get("product_name"),
        measurement_unit_id: row.get("measurement_unit_id"),
        list_unit_price: row.get("list_unit_price"),
    }
}

#[derive(Debug)]
pub struct PostgresProductRepository {
    pool: PgPool,
}

impl PostgresProductRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl ProductRepository for PostgresProductRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "product_repository.find_all", skip(self))]
    async fn find_all(&self, account_id: i32) -> Result<Vec<Product>, Self::Error> {
        let products = sqlx::query(
            r#"
                SELECT products.*, current_product_prices.price::FLOAT AS list_unit_price
                  FROM products
                  LEFT JOIN current_product_prices
                    ON products.product_code = current_product_prices.product_code
                 WHERE products.account_id = $1
                 ORDER BY product_name
            "#,
        )
        .bind(account_id)
        .map(product_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(products)
    }

    #[tracing::instrument(name = "product_repository.find_by_code", skip(self))]
    async fn find_by_code(
        &self,
        account_id: i32,
        product_code: i32,
    ) -> Result<Product, Self::Error> {
        let product = sqlx::query(
            r#"
                SELECT products.*, current_product_prices.price::FLOAT AS list_unit_price
                  FROM products
                  JOIN current_product_prices
                    ON products.product_code = current_product_prices.product_code
                 WHERE products.account_id = $1
                   AND products.product_code = $2
            "#,
        )
        .bind(account_id)
        .bind(product_code)
        .map(product_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(product)
    }

    #[tracing::instrument(name = "product_repository.create", skip(self))]
    async fn create(
        &self,
        account_id: i32,
        request: ProductCreateRequest,
    ) -> Result<Product, Self::Error> {
        let product_code = sqlx::query(
            r#"
                   INSERT INTO products (account_id, product_name, measurement_unit_id)
                   VALUES ($1, $2, $3)
                RETURNING product_code
            "#,
        )
        .bind(account_id)
        .bind(&request.product_name)
        .bind(&request.measurement_unit_id)
        .map(|row: PgRow| row.get(0))
        .fetch_one(&self.pool)
        .await?;

        sqlx::query(
            r#"
                INSERT INTO product_prices (account_id, product_code, price, valid_since)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            "#,
        )
        .bind(account_id)
        .bind(product_code)
        .bind(request.list_unit_price)
        .execute(&self.pool)
        .await?;

        let product = self.find_by_code(account_id, product_code).await?;

        Ok(product)
    }

    #[tracing::instrument(name = "product_repository.update", skip(self))]
    async fn update(
        &self,
        account_id: i32,
        product_code: i32,
        request: ProductUpdateRequest,
    ) -> Result<Product, Self::Error> {
        sqlx::query(
            r#"
                UPDATE products SET product_name = $1
                 WHERE account_id = $2
                   AND product_code = $3
            "#,
        )
        .bind(&request.product_name)
        .bind(account_id)
        .bind(product_code)
        .execute(&self.pool)
        .await?;

        let product = self.find_by_code(account_id, product_code).await?;

        Ok(product)
    }

    #[tracing::instrument(name = "product_repository.delete", skip(self))]
    async fn delete(&self, account_id: i32, product_code: i32) -> Result<u64, Self::Error> {
        let deleted: PgDone = sqlx::query(
            r#"
                DELETE FROM products
                 WHERE   account_id = $1
                   AND product_code = $2
           "#,
        )
        .bind(account_id)
        .bind(product_code)
        .execute(&self.pool)
        .await?;

        Ok(deleted.rows_affected())
    }
}

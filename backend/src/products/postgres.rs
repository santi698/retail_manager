use sqlx::postgres::{PgPool, PgRow};
use sqlx::Row;

use super::{Product, ProductCreateRequest, ProductRepository, ProductUpdateRequest};

fn product_from_row(row: PgRow) -> Product {
    Product {
        product_code: row.get("product_code"),
        product_name: row.get("product_name"),
        measurement_unit_id: row.get("measurement_unit_id"),
        list_unit_price: row.get("list_unit_price"),
    }
}

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
    async fn find_all(&self) -> anyhow::Result<Vec<Product>> {
        let products = sqlx::query(
            r#"
                SELECT products.*, current_product_prices.price::FLOAT AS list_unit_price
                FROM products
                JOIN current_product_prices
                  ON products.product_code = current_product_prices.product_code
                ORDER BY product_name
            "#,
        )
        .map(product_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(products)
    }

    async fn find_by_code(&self, product_code: i32) -> anyhow::Result<Product> {
        let product = sqlx::query(
            r#"
                SELECT products.*, current_product_prices.price::FLOAT AS list_unit_price
                  FROM products
                  JOIN current_product_prices
                    ON products.product_code = current_product_prices.product_code
                 WHERE products.product_code = $1
            "#,
        )
        .bind(product_code)
        .map(product_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(product)
    }

    async fn create(&self, request: ProductCreateRequest) -> anyhow::Result<Product> {
        let product_code = sqlx::query(
            r#"
                INSERT INTO products (product_name, measurement_unit_id) VALUES ($1, $2)
                RETURNING product_code
            "#,
        )
        .bind(&request.product_name)
        .bind(&request.measurement_unit_id)
        .map(|row: PgRow| row.get(0))
        .fetch_one(&self.pool)
        .await?;

        let product = self.find_by_code(product_code).await?;

        Ok(product)
    }

    async fn update(
        &self,
        product_code: i32,
        request: ProductUpdateRequest,
    ) -> anyhow::Result<Product> {
        sqlx::query(
            r#"
                UPDATE products SET product_name = $1
                WHERE product_code = $2
            "#,
        )
        .bind(&request.product_name)
        .bind(product_code)
        .execute(&self.pool)
        .await?;

        let product = self.find_by_code(product_code).await?;

        Ok(product)
    }

    async fn delete(&self, product_code: i32) -> anyhow::Result<u64> {
        let deleted = sqlx::query("DELETE FROM products WHERE product_code = $1")
            .bind(product_code)
            .execute(&self.pool)
            .await?;

        Ok(deleted)
    }
}

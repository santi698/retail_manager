use actix_web::{Error, HttpRequest, HttpResponse, Responder};
use anyhow::Result;
use futures::future::{ready, Ready};
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgQueryAs, PgRow};
use sqlx::{FromRow, Row};

#[derive(Serialize, Deserialize)]
pub struct ProductUpdateRequest {
    pub product_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct ProductCreateRequest {
    pub product_name: String,
    pub measurement_unit_id: i32,
}

#[derive(Serialize, FromRow)]
pub struct Product {
    pub product_code: i32,
    pub product_name: String,
    pub measurement_unit_id: i32,
    pub list_unit_price: f64,
}

impl Responder for Product {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        // create response and set content type
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

impl Product {
    pub async fn find_all(pool: &PgPool) -> Result<Vec<Product>> {
        let products = sqlx::query_as::<_, Product>(
            r#"
                SELECT products.*, current_product_prices.price::FLOAT AS list_unit_price
                FROM products
                JOIN current_product_prices
                  ON products.product_code = current_product_prices.product_code
                ORDER BY product_name
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(products)
    }

    pub async fn find_by_code(product_code: i32, pool: &PgPool) -> Result<Product> {
        let product = sqlx::query_as::<_, Product>(
            r#"
                SELECT products.*, current_product_prices.price::FLOAT AS list_unit_price
                  FROM products
                  JOIN current_product_prices
                    ON products.product_code = current_product_prices.product_code
                 WHERE products.product_code = $1
            "#,
        )
        .bind(product_code)
        .fetch_one(pool)
        .await?;

        Ok(product)
    }

    pub async fn create(request: ProductCreateRequest, pool: &PgPool) -> Result<Product> {
        let product_code = sqlx::query(
            r#"
                INSERT INTO products (product_name, measurement_unit_id) VALUES ($1, $2)
                RETURNING product_code
            "#,
        )
        .bind(&request.product_name)
        .bind(&request.measurement_unit_id)
        .map(|row: PgRow| row.get(0))
        .fetch_one(pool)
        .await?;

        let product = Self::find_by_code(product_code, pool).await?;

        Ok(product)
    }

    pub async fn update(
        product_code: i32,
        request: ProductUpdateRequest,
        pool: &PgPool,
    ) -> Result<Product> {
        sqlx::query(
            r#"
                UPDATE products SET product_name = $1
                WHERE product_code = $2
            "#,
        )
        .bind(&request.product_name)
        .bind(product_code)
        .execute(pool)
        .await?;

        let product = Self::find_by_code(product_code, pool).await?;

        Ok(product)
    }

    pub async fn delete(product_code: i32, pool: &PgPool) -> Result<u64> {
        let mut tx = pool.begin().await?;
        let deleted = sqlx::query!("DELETE FROM products WHERE product_code = $1", product_code)
            .execute(&mut tx)
            .await?;

        tx.commit().await?;
        Ok(deleted)
    }
}

use crate::types::RepositoryError;
use pricing::{ProductPrice, ProductPriceRepository, ProductPriceSetRequest};
use sqlx::{postgres::PgRow, PgPool, Row};

fn product_price_from_row(row: PgRow) -> ProductPrice {
    ProductPrice {
        product_code: row.get("product_code"),
        price: row.get("price"),
        valid_since: row.get("valid_since"),
    }
}

#[derive(Debug)]
pub struct PostgresProductPriceRepository {
    pool: PgPool,
}

impl PostgresProductPriceRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl ProductPriceRepository for PostgresProductPriceRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "product_price_repository.get_current_price", skip(self))]
    async fn get_current_price(
        &self,
        account_id: i32,
        product_code: i32,
    ) -> Result<ProductPrice, Self::Error> {
        let products = sqlx::query(
            r#"
                SELECT *
                  FROM product_prices
                 WHERE account_id = $1 AND product_code = $2 AND valid_since <= CURRENT_TIMESTAMP
                 ORDER BY valid_since DESC
                 LIMIT 1
            "#,
        )
        .bind(account_id)
        .bind(product_code)
        .map(product_price_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(products)
    }

    #[tracing::instrument(name = "product_price_repository.set_price", skip(self))]
    async fn set_price(
        &self,
        account_id: i32,
        product_code: i32,
        request: ProductPriceSetRequest,
    ) -> Result<ProductPrice, Self::Error> {
        let product = sqlx::query(
            r#"
                INSERT INTO product_prices(account_id, product_code, valid_since, price)
                     VALUES ($1, $2, $3, $4)
                  RETURNING *
            "#,
        )
        .bind(account_id)
        .bind(product_code)
        .bind(chrono::Utc::now().naive_utc())
        .bind(request.price)
        .map(product_price_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(product)
    }
}

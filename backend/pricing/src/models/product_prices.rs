use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductPrice {
    pub product_code: i32,
    pub valid_since: chrono::NaiveDateTime,
    pub price: f64,
}

#[derive(Debug, Deserialize)]
pub struct ProductPriceSetRequest {
    pub price: f64,
}

#[async_trait::async_trait]
pub trait ProductPriceRepository {
    type Error;

    async fn get_current_price(
        &self,
        account_id: i32,
        product_code: i32,
    ) -> Result<ProductPrice, Self::Error>;
    async fn set_price(
        &self,
        account_id: i32,
        product_code: i32,
        request: ProductPriceSetRequest,
    ) -> Result<ProductPrice, Self::Error>;
}

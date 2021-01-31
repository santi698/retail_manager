use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductUpdateRequest {
    pub product_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductCreateRequest {
    pub product_name: String,
    pub measurement_unit_id: i32,
    pub list_unit_price: f64,
}

#[derive(Debug, Serialize)]
pub struct Product {
    pub account_id: i32,
    pub product_code: i32,
    pub product_name: String,
    pub measurement_unit_id: i32,
    pub list_unit_price: f64,
}

#[async_trait]
pub trait ProductRepository {
    type Error;

    async fn find_all(&self, account_id: i32) -> Result<Vec<Product>, Self::Error>;
    async fn find_by_code(
        &self,
        account_id: i32,
        product_code: i32,
    ) -> Result<Product, Self::Error>;
    async fn create(
        &self,
        account_id: i32,
        request: ProductCreateRequest,
    ) -> Result<Product, Self::Error>;
    async fn update(
        &self,
        account_id: i32,
        product_code: i32,
        request: ProductUpdateRequest,
    ) -> Result<Product, Self::Error>;
    async fn delete(&self, account_id: i32, product_code: i32) -> Result<u64, Self::Error>;
}

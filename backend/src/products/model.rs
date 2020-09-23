use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ProductUpdateRequest {
    pub product_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct ProductCreateRequest {
    pub product_name: String,
    pub measurement_unit_id: i32,
}

#[derive(Serialize)]
pub struct Product {
    pub product_code: i32,
    pub product_name: String,
    pub measurement_unit_id: i32,
    pub list_unit_price: f64,
}

#[async_trait]
pub trait ProductRepository {
    async fn find_all(&self) -> Result<Vec<Product>>;
    async fn find_by_code(&self, product_code: i32) -> Result<Product>;
    async fn create(&self, request: ProductCreateRequest) -> Result<Product>;
    async fn update(&self, product_code: i32, request: ProductUpdateRequest) -> Result<Product>;
    async fn delete(&self, product_code: i32) -> Result<u64>;
}

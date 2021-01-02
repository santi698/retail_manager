use serde::{Deserialize, Serialize};

use crate::types;

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
    pub account_id: i32,
    pub product_code: i32,
    pub product_name: String,
    pub measurement_unit_id: i32,
    pub list_unit_price: f64,
}

#[async_trait]
pub trait ProductRepository {
    async fn find_all(&self, account_id: i32) -> types::RepositoryResult<Vec<Product>>;
    async fn find_by_code(
        &self,
        account_id: i32,
        product_code: i32,
    ) -> types::RepositoryResult<Product>;
    async fn create(
        &self,
        account_id: i32,
        request: ProductCreateRequest,
    ) -> types::RepositoryResult<Product>;
    async fn update(
        &self,
        account_id: i32,
        product_code: i32,
        request: ProductUpdateRequest,
    ) -> types::RepositoryResult<Product>;
    async fn delete(&self, account_id: i32, product_code: i32) -> types::RepositoryResult<u64>;
}

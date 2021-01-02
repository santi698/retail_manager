use serde::{Deserialize, Serialize};

use crate::types;

#[derive(Serialize, Deserialize)]
pub struct ClientOrderCreateRequest {
    pub client_id: i32,
    pub order_city_id: i32,
}

#[derive(Serialize, Deserialize)]
pub struct ClientOrderUpdateRequest {
    pub order_city_id: i32,
    pub order_status: String,
    pub payment_status: String,
}

#[derive(Serialize, Deserialize)]
pub struct ClientOrderAddItemRequest {
    pub product_id: i32,
    pub quantity: f64,
    pub selling_price: f64,
}

#[derive(Serialize)]
pub struct ClientOrder {
    pub account_id: i32,
    pub order_id: i32,
    pub ordered_at: chrono::NaiveDateTime,
    pub client_id: i32,
    pub order_city_id: i32,
    pub order_status: String,
    pub payment_status: String,
    pub total_price: f64,
    pub address: Option<String>,
}

#[derive(Serialize)]
pub struct ClientOrderItem {
    pub account_id: i32,
    pub client_order_item_id: i32,
    pub product_id: i32,
    pub client_order_id: i32,
    pub quantity: f64,
    pub selling_price: f64,
}

#[async_trait]
pub trait ClientOrderRepository {
    async fn find_all(&self, account_id: i32) -> types::RepositoryResult<Vec<ClientOrder>>;
    async fn find_by_id(&self, account_id: i32, id: i32) -> types::RepositoryResult<ClientOrder>;
    async fn create(
        &self,
        account_id: i32,
        request: ClientOrderCreateRequest,
    ) -> types::RepositoryResult<ClientOrder>;
    async fn update(
        &self,
        account_id: i32,
        id: i32,
        request: ClientOrderUpdateRequest,
    ) -> types::RepositoryResult<ClientOrder>;
    async fn find_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> types::RepositoryResult<ClientOrderItem>;
    async fn find_items(
        &self,
        account_id: i32,
        order_id: i32,
    ) -> types::RepositoryResult<Vec<ClientOrderItem>>;
    async fn add_item(
        &self,
        account_id: i32,
        order_id: i32,
        request: ClientOrderAddItemRequest,
    ) -> types::RepositoryResult<ClientOrderItem>;
    async fn remove_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> types::RepositoryResult<()>;
}

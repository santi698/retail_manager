use serde::{Deserialize, Serialize};

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
    pub client_order_item_id: i32,
    pub product_id: i32,
    pub client_order_id: i32,
    pub quantity: f64,
    pub selling_price: f64,
}

#[async_trait]
pub trait ClientOrderRepository {
    async fn find_all(&self) -> anyhow::Result<Vec<ClientOrder>>;
    async fn find_by_id(&self, id: i32) -> anyhow::Result<ClientOrder>;
    async fn create(&self, request: ClientOrderCreateRequest) -> anyhow::Result<ClientOrder>;
    async fn update(
        &self,
        id: i32,
        request: ClientOrderUpdateRequest,
    ) -> anyhow::Result<ClientOrder>;
    async fn find_item(&self, order_id: i32, item_id: i32) -> anyhow::Result<ClientOrderItem>;
    async fn find_items(&self, order_id: i32) -> anyhow::Result<Vec<ClientOrderItem>>;
    async fn add_item(
        &self,
        order_id: i32,
        request: ClientOrderAddItemRequest,
    ) -> anyhow::Result<ClientOrderItem>;
    async fn remove_item(&self, order_id: i32, item_id: i32) -> anyhow::Result<()>;
}

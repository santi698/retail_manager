use async_trait::async_trait;

use serde::{Deserialize, Serialize};
use types::PaymentStatus;

use crate::types::{self, OrderStatus};

#[derive(Deserialize, Debug)]
pub struct ClientOrderCreateRequest {
    pub client_id: i32,
    pub order_city_id: i32,
}

#[derive(Deserialize, Debug)]
pub struct ClientOrderUpdateRequest {
    pub order_city_id: i32,
    pub order_status: OrderStatus,
    pub payment_status: PaymentStatus,
}

#[derive(Deserialize, Debug)]
pub struct ClientOrderAddItemRequest {
    pub product_id: i32,
    pub quantity: f64,
    pub selling_price: f64,
}

#[derive(Serialize, Debug)]
pub struct ClientOrder {
    pub account_id: i32,
    pub order_id: i32,
    pub ordered_at: chrono::NaiveDateTime,
    pub client_id: i32,
    pub order_city_id: i32,
    pub order_status: OrderStatus,
    pub payment_status: PaymentStatus,
    pub total_price: f64,
    pub address: Option<String>,
}

#[derive(Serialize, Debug)]
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
    type Error;

    async fn find_all(&self, account_id: i32) -> Result<Vec<ClientOrder>, Self::Error>;
    async fn find_by_id(&self, account_id: i32, id: i32) -> Result<ClientOrder, Self::Error>;
    async fn create(
        &self,
        account_id: i32,
        request: ClientOrderCreateRequest,
    ) -> Result<ClientOrder, Self::Error>;
    async fn update(
        &self,
        account_id: i32,
        id: i32,
        request: ClientOrderUpdateRequest,
    ) -> Result<ClientOrder, Self::Error>;
    async fn find_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> Result<ClientOrderItem, Self::Error>;
    async fn find_items(
        &self,
        account_id: i32,
        order_id: i32,
    ) -> Result<Vec<ClientOrderItem>, Self::Error>;
    async fn add_item(
        &self,
        account_id: i32,
        order_id: i32,
        request: ClientOrderAddItemRequest,
    ) -> Result<ClientOrderItem, Self::Error>;
    async fn remove_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> Result<(), Self::Error>;
}

use async_trait::async_trait;

use crate::types::OrderStatus;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct CustomerOrderCreateRequest {
    pub customer_id: i32,
    pub order_city_id: i32,
}

#[derive(Deserialize, Debug)]
pub struct CustomerOrderUpdateRequest {
    pub order_city_id: i32,
    pub order_status: OrderStatus,
}

#[derive(Deserialize, Debug)]
pub struct CustomerOrderAddItemRequest {
    pub product_id: i32,
    pub quantity: f64,
    pub selling_price: f64,
}

#[derive(Serialize, Debug)]
pub struct CustomerOrder {
    pub account_id: i32,
    pub order_id: i32,
    pub ordered_at: chrono::NaiveDateTime,
    pub customer_id: i32,
    pub order_city_id: i32,
    pub order_status: OrderStatus,
    pub total_price: f64,
    pub address: Option<String>,
}

#[derive(Serialize, Debug)]
pub struct CustomerOrderItem {
    pub account_id: i32,
    pub customer_order_item_id: i32,
    pub product_id: i32,
    pub customer_order_id: i32,
    pub quantity: f64,
    pub selling_price: f64,
}

#[async_trait]
pub trait CustomerOrderRepository {
    type Error;

    async fn find_all(&self, account_id: i32) -> Result<Vec<CustomerOrder>, Self::Error>;
    async fn find_by_id(&self, account_id: i32, id: i32) -> Result<CustomerOrder, Self::Error>;
    async fn create(
        &self,
        account_id: i32,
        request: &CustomerOrderCreateRequest,
    ) -> Result<CustomerOrder, Self::Error>;
    async fn update(
        &self,
        account_id: i32,
        id: i32,
        request: &CustomerOrderUpdateRequest,
    ) -> Result<CustomerOrder, Self::Error>;
    async fn find_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> Result<CustomerOrderItem, Self::Error>;
    async fn find_items(
        &self,
        account_id: i32,
        order_id: i32,
    ) -> Result<Vec<CustomerOrderItem>, Self::Error>;
    async fn add_item(
        &self,
        account_id: i32,
        order_id: i32,
        request: &CustomerOrderAddItemRequest,
    ) -> Result<CustomerOrderItem, Self::Error>;
    async fn remove_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> Result<(), Self::Error>;
}

use std::convert::{TryFrom, TryInto};

use serde::{Deserialize, Serialize};
use types::PaymentStatus;

use crate::types::{self, OrderStatus};

use super::routes::ClientOrderUpdateJson;

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

impl TryFrom<ClientOrderUpdateJson> for ClientOrderUpdateRequest {
    type Error = String;

    fn try_from(value: ClientOrderUpdateJson) -> Result<Self, Self::Error> {
        Ok(Self {
            order_city_id: value.order_city_id,
            order_status: value.order_status.try_into()?,
            payment_status: value.payment_status.try_into()?,
        })
    }
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

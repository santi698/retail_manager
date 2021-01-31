use crate::types;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct ClientCreateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<types::Email>,
    pub phone_number: Option<types::PhoneNumber>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientUpdateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<types::Email>,
    pub phone_number: Option<types::PhoneNumber>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct Client {
    pub client_id: i32,
    pub account_id: i32,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<types::Email>,
    pub phone_number: Option<types::PhoneNumber>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[async_trait]
pub trait ClientRepository {
    type Error;

    async fn find_all(&self, account_id: i32) -> Result<Vec<Client>, Self::Error>;
    async fn find_by_id(&self, account_id: i32, client_id: i32) -> Result<Client, Self::Error>;
    async fn create(
        &self,
        account_id: i32,
        request: ClientCreateRequest,
    ) -> Result<Client, Self::Error>;
    async fn update(
        &self,
        account_id: i32,
        client_id: i32,
        request: ClientUpdateRequest,
    ) -> Result<Client, Self::Error>;
}

use anyhow::Result;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct ClientCreateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub residence_city_id: i32,
}

#[derive(Serialize, Deserialize)]
pub struct ClientUpdateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub residence_city_id: i32,
}

#[derive(Serialize)]
pub struct Client {
    pub client_id: i32,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub residence_city_id: i32,
}

#[async_trait]
pub trait ClientRepository {
    async fn find_all(&self) -> Result<Vec<Client>>;
    async fn find_by_id(&self, client_id: i32) -> Result<Client>;
    async fn create(&self, request: ClientCreateRequest) -> Result<Client>;
    async fn update(&self, client_id: i32, request: ClientUpdateRequest) -> Result<Client>;
}

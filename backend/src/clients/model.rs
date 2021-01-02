use crate::types;
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct ClientCreateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<types::Email>,
    pub phone_number: Option<types::PhoneNumber>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ClientUpdateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<types::Email>,
    pub phone_number: Option<types::PhoneNumber>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[derive(Serialize)]
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
    async fn find_all(&self, account_id: i32) -> types::RepositoryResult<Vec<Client>>;
    async fn find_by_id(&self, account_id: i32, client_id: i32) -> types::RepositoryResult<Client>;
    async fn create(
        &self,
        account_id: i32,
        request: ClientCreateRequest,
    ) -> types::RepositoryResult<Client>;
    async fn update(
        &self,
        account_id: i32,
        client_id: i32,
        request: ClientUpdateRequest,
    ) -> types::RepositoryResult<Client>;
}

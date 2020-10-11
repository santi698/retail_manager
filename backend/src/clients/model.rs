use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct ClientCreateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ClientUpdateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[derive(Serialize)]
pub struct Client {
    pub client_id: i32,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[async_trait]
pub trait ClientRepository {
    async fn find_all(&self) -> anyhow::Result<Vec<Client>>;
    async fn find_by_id(&self, client_id: i32) -> anyhow::Result<Client>;
    async fn create(&self, request: ClientCreateRequest) -> anyhow::Result<Client>;
    async fn update(&self, client_id: i32, request: ClientUpdateRequest) -> anyhow::Result<Client>;
}

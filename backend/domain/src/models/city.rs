use async_trait::async_trait;

#[derive(serde::Serialize)]
pub struct City {
    pub id: i32,
    pub account_id: i32,
    pub name: String,
}

#[derive(serde::Deserialize)]
pub struct CityCreateRequest {
    pub name: String,
}

#[async_trait]
pub trait CityRepository {
    type Error;

    async fn find_all(&self, account_id: i32) -> Result<Vec<City>, Self::Error>;
    async fn find_by_id(&self, account_id: i32, id: i32) -> Result<City, Self::Error>;
    async fn create(
        &self,
        account_id: i32,
        request: CityCreateRequest,
    ) -> Result<City, Self::Error>;
}

use serde::Serialize;

#[derive(Serialize)]
pub struct City {
    pub id: i32,
    pub name: String,
}

#[async_trait]
pub trait CityRepository {
    async fn find_all(&self) -> anyhow::Result<Vec<City>>;
    async fn find_by_id(&self, id: i32) -> anyhow::Result<City>;
}

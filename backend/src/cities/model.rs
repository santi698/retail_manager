use serde::Serialize;

use crate::types;

#[derive(Serialize)]
pub struct City {
    pub id: i32,
    pub account_id: i32,
    pub name: String,
}

#[async_trait]
pub trait CityRepository {
    async fn find_all(&self, account_id: i32) -> types::RepositoryResult<Vec<City>>;
    async fn find_by_id(&self, account_id: i32, id: i32) -> types::RepositoryResult<City>;
}

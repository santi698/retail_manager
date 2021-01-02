use serde::Serialize;

use crate::types;

#[derive(Serialize)]
pub struct MeasurementUnit {
    pub id: i32,
    pub unit_name: String,
    pub symbol: String,
}

#[async_trait]
pub trait MeasurementUnitRepository {
    async fn find_all(&self) -> types::RepositoryResult<Vec<MeasurementUnit>>;
    async fn find_by_id(&self, id: i32) -> types::RepositoryResult<MeasurementUnit>;
}

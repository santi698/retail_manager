use async_trait::async_trait;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct MeasurementUnit {
    pub id: i32,
    pub unit_name: String,
    pub symbol: String,
}

#[async_trait]
pub trait MeasurementUnitRepository {
    type Error;

    async fn find_all(&self) -> Result<Vec<MeasurementUnit>, Self::Error>;
    async fn find_by_id(&self, id: i32) -> Result<MeasurementUnit, Self::Error>;
}

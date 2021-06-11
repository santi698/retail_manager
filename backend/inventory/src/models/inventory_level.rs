use async_trait::async_trait;
use sqlx::types::chrono;

#[derive(serde::Serialize, Debug)]
pub struct InventoryLevel {
    pub id: i32,
    pub account_id: i32,
    pub product_code: i32,
    pub timestamp: chrono::NaiveDateTime,
    pub level_change: f64,
    pub current_level: f64,
    pub reason: Option<String>,
}

impl InventoryLevel {
    pub fn zero(account_id: i32, product_code: i32) -> Self {
        Self {
            id: -1,
            account_id,
            product_code,
            timestamp: chrono::Utc::now().naive_utc(),
            current_level: 0f64,
            level_change: 0f64,
            reason: None,
        }
    }
}

#[derive(serde::Deserialize, Debug)]
pub struct FindInventoryLevelsRequest {
    pub product_code: i32,
    pub from_date: chrono::NaiveDateTime,
    pub to_date: chrono::NaiveDateTime,
}

#[derive(serde::Deserialize, Debug)]
pub struct ChangeInventoryLevelRequest {
    pub product_code: i32,
    pub level_change: f64,
    pub reason: Option<String>,
}

#[async_trait]
pub trait InventoryLevelRepository {
    type Error;

    async fn current_level(
        &self,
        account_id: i32,
        product_code: i32,
    ) -> Result<InventoryLevel, Self::Error>;
    async fn find_levels(
        &self,
        account_id: i32,
        request: FindInventoryLevelsRequest,
    ) -> Result<Vec<InventoryLevel>, Self::Error>;
    async fn change_level(
        &self,
        account_id: i32,
        request: ChangeInventoryLevelRequest,
    ) -> Result<InventoryLevel, Self::Error>;
}

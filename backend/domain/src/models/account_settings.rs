use async_trait::async_trait;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct AccountSettings {
    pub account_id: i32,
    pub has_stock_non_negative_invariant: bool,
}

#[async_trait]
pub trait AccountSettingsRepository {
    type Error;
    async fn find_by_account_id(&self, account_id: i32) -> Result<AccountSettings, Self::Error>;
    async fn set_by_account_id(
        &self,
        account_id: i32,
        new_settings: &AccountSettings,
    ) -> Result<AccountSettings, Self::Error>;
}

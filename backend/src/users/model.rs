use serde::Serialize;

use crate::types;

#[derive(Debug, Serialize)]
pub struct User {
    pub id: i32,
    pub account_id: i32,
    pub first_name: String,
    pub last_name: String,
}

#[async_trait]
pub trait UserRepository {
    async fn find_by_id(&self, id: i32) -> types::RepositoryResult<User>;
}

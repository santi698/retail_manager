use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct User {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
}

#[async_trait]
pub trait UserRepository {
    async fn find_by_id(&self, id: i32) -> anyhow::Result<User>;
}

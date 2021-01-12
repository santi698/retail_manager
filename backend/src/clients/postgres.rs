use sqlx::postgres::{PgPool, PgRow};
use sqlx::Row;

use crate::types::{self, Email, PhoneNumber};

use super::{Client, ClientCreateRequest, ClientRepository, ClientUpdateRequest};

#[derive(Debug)]
pub struct PostgresClientRepository {
    pool: PgPool,
}

impl PostgresClientRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl ClientRepository for PostgresClientRepository {
    #[tracing::instrument(name = "client_repository.find_all", skip(self))]
    async fn find_all(&self, account_id: i32) -> types::RepositoryResult<Vec<Client>> {
        let clients = sqlx::query(
            r#"
                SELECT *
                FROM clients
                WHERE account_id = $1
                ORDER BY client_id;
            "#,
        )
        .bind(account_id)
        .map(client_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(clients)
    }

    #[tracing::instrument(name = "client_repository.find_by_id", skip(self))]
    async fn find_by_id(&self, account_id: i32, client_id: i32) -> types::RepositoryResult<Client> {
        let client = sqlx::query(
            r#"
                SELECT *
                FROM clients
                WHERE account_id = $1
                  AND  client_id = $2
            "#,
        )
        .bind(account_id)
        .bind(client_id)
        .map(client_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(client)
    }

    #[tracing::instrument(name = "client_repository.create", skip(self))]
    async fn create(
        &self,
        account_id: i32,
        request: ClientCreateRequest,
    ) -> types::RepositoryResult<Client> {
        let client = sqlx::query(
            r#"
                INSERT INTO clients (
                    account_id,
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    residence_city_id,
                    address
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING client_id,
                          first_name,
                          last_name,
                          email,
                          phone_number,
                          residence_city_id,
                          address
            "#,
        )
        .bind(account_id)
        .bind(&request.first_name)
        .bind(&request.last_name)
        .bind(&request.email.as_deref())
        .bind(&request.phone_number.as_deref())
        .bind(&request.residence_city_id)
        .bind(&request.address)
        .map(client_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(client)
    }

    #[tracing::instrument(name = "client_repository.update", skip(self))]
    async fn update(
        &self,
        account_id: i32,
        client_id: i32,
        request: ClientUpdateRequest,
    ) -> types::RepositoryResult<Client> {
        let client = sqlx::query(
            r#"
                UPDATE clients
                SET first_name = $1,
                    last_name = $2,
                    email = $3,
                    phone_number = $4,
                    residence_city_id = $5,
                    address = $6
                WHERE account_id = $7
                  AND  client_id = $8
                RETURNING client_id,
                          first_name,
                          last_name,
                          email,
                          phone_number,
                          residence_city_id,
                          address
            "#,
        )
        .bind(&request.first_name)
        .bind(&request.last_name)
        .bind(&request.email.as_deref())
        .bind(&request.phone_number.as_deref())
        .bind(&request.residence_city_id)
        .bind(&request.address)
        .bind(account_id)
        .bind(client_id)
        .map(client_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(client)
    }
}

fn client_from_row(row: PgRow) -> Client {
    let email_str: Option<String> = row.get("email");
    let email: Option<Email> = email_str.map(|s| s.parse().expect("Invalid email"));
    let phone_number_str: Option<String> = row.get("phone_number");
    let phone_number: Option<PhoneNumber> =
        phone_number_str.map(|n| n.parse().expect("Invalid phone number"));
    Client {
        account_id: row.get("account_id"),
        client_id: row.get("client_id"),
        first_name: row.get("first_name"),
        last_name: row.get("last_name"),
        email,
        phone_number,
        residence_city_id: row.get("residence_city_id"),
        address: row.get("address"),
    }
}

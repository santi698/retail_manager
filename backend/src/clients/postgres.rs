use sqlx::postgres::{PgPool, PgRow};
use sqlx::Row;

use super::{Client, ClientCreateRequest, ClientRepository, ClientUpdateRequest};

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
    async fn find_all(&self) -> anyhow::Result<Vec<Client>> {
        let clients = sqlx::query(
            r#"
                SELECT *
                FROM clients
                ORDER BY client_id;
            "#,
        )
        .map(client_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(clients)
    }

    async fn find_by_id(&self, client_id: i32) -> anyhow::Result<Client> {
        let client = sqlx::query_as!(
            Client,
            r#"
                SELECT * FROM clients WHERE client_id = $1
            "#,
            client_id
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(client)
    }

    async fn create(&self, request: ClientCreateRequest) -> anyhow::Result<Client> {
        let client = sqlx::query(
            r#"
                INSERT INTO clients (
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    residence_city_id
                )
                VALUES ($1, $2, $3, $4, $5, $6)
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
        .bind(&request.email)
        .bind(&request.phone_number)
        .bind(&request.residence_city_id)
        .bind(&request.address)
        .map(client_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(client)
    }

    async fn update(&self, client_id: i32, request: ClientUpdateRequest) -> anyhow::Result<Client> {
        let client = sqlx::query(
            r#"
                UPDATE clients
                SET first_name = $1,
                    last_name = $2,
                    email = $3,
                    phone_number = $4,
                    residence_city_id = $5,
                    address = $6
                WHERE client_id = $7
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
        .bind(&request.email)
        .bind(&request.phone_number)
        .bind(&request.residence_city_id)
        .bind(&request.address)
        .bind(client_id)
        .map(client_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(client)
    }
}

fn client_from_row(row: PgRow) -> Client {
    Client {
        client_id: row.get("client_id"),
        first_name: row.get("first_name"),
        last_name: row.get("last_name"),
        email: row.get("email"),
        phone_number: row.get("phone_number"),
        residence_city_id: row.get("residence_city_id"),
        address: row.get("address"),
    }
}

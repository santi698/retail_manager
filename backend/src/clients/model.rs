use actix_web::{Error, HttpRequest, HttpResponse, Responder};
use anyhow::Result;
use futures::future::{ready, Ready};
use log::info;
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgQueryAs, PgRow};
use sqlx::{FromRow, Row};

#[derive(Serialize, Deserialize)]
pub struct ClientCreateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub residence_city_id: i32,
}

#[derive(Serialize, Deserialize)]
pub struct ClientUpdateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
}

#[derive(Serialize, FromRow)]
pub struct Client {
    pub client_id: i32,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub residence_city_id: i32,
}

impl Responder for Client {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;
    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

impl Client {
    pub async fn find_all(pool: &sqlx::PgPool) -> Result<Vec<Client>> {
        let clients = sqlx::query_as::<_, Client>(
            r#"
                SELECT *
                FROM clients
                ORDER BY client_id;
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(clients)
    }

    pub async fn find_by_id(client_id: i32, pool: &PgPool) -> Result<Client> {
        let client = sqlx::query_as!(
            Client,
            r#"
                SELECT * FROM clients WHERE client_id = $1
            "#,
            client_id
        )
        .fetch_one(pool)
        .await?;

        Ok(client)
    }

    pub async fn create(request: ClientCreateRequest, pool: &PgPool) -> Result<Client> {
        let mut tx = pool.begin().await?;
        info!("{}", &request.phone_number.clone().expect("msg"));
        let client = sqlx::query(
            r#"
                INSERT INTO clients (first_name, last_name, email, phone_number, residence_city_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING client_id, first_name, last_name, email, phone_number, residence_city_id
            "#,
        )
        .bind(&request.first_name)
        .bind(&request.last_name)
        .bind(&request.email)
        .bind(&request.phone_number)
        .bind(&request.residence_city_id)
        .map(|row: PgRow| Client {
            client_id: row.get(0),
            first_name: row.get(1),
            last_name: row.get(2),
            email: row.get(3),
            phone_number: row.get(4),
            residence_city_id: row.get(5),
        })
        .fetch_one(&mut tx)
        .await?;

        tx.commit().await?;
        Ok(client)
    }
}

use actix_web::{Error, HttpRequest, HttpResponse, Responder};
use anyhow::Result;
use futures::future::{ready, Ready};
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgQueryAs};
use sqlx::{FromRow};

#[derive(Serialize, Deserialize)]
pub struct ClientOrderCreateRequest {
    pub client_id: i32,
    pub order_city_id: i32,
}

#[derive(Serialize, FromRow)]
pub struct ClientOrder {
    pub order_id: i32,
    pub client_id: i32,
    pub order_city_id: i32,
}

impl Responder for ClientOrder {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;
    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

impl ClientOrder {
    pub async fn find_all(pool: &PgPool) -> Result<Vec<ClientOrder>> {
        let orders =
            sqlx::query_as::<_, ClientOrder>("SELECT * FROM client_orders ORDER BY order_id;")
                .fetch_all(pool)
                .await?;

        Ok(orders)
    }
}

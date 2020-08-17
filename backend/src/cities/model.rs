use actix_web::{Error, HttpRequest, HttpResponse, Responder};
use anyhow::Result;
use futures::future::{ready, Ready};
use serde::Serialize;
use sqlx::postgres::{PgPool, PgQueryAs};
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct City {
    pub id: i32,
    pub name: String,
}

impl Responder for City {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        // create response and set content type
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

impl City {
    pub async fn find_all(pool: &PgPool) -> Result<Vec<City>> {
        let products = sqlx::query_as::<_, City>(
            r#"
                SELECT *
                FROM cities
                ORDER BY id
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(products)
    }

    pub async fn find_by_id(id: i32, pool: &PgPool) -> Result<City> {
        let product = sqlx::query_as::<_, City>(
            r#"
                SELECT * FROM cities WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_one(pool)
        .await?;

        Ok(product)
    }
}

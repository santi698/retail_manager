use actix_web::{Error, HttpRequest, HttpResponse, Responder};
use anyhow::Result;
use futures::{future::ready, future::Ready};
use serde::Serialize;
use sqlx::{postgres::PgQueryAs, FromRow, PgPool};

#[derive(Serialize, FromRow)]
pub struct MeasurementUnit {
    id: i32,
    unit_name: String,
    symbol: String,
}

impl Responder for MeasurementUnit {
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

impl MeasurementUnit {
    pub async fn find_all(pool: &PgPool) -> Result<Vec<MeasurementUnit>> {
        let products = sqlx::query_as::<_, MeasurementUnit>(
            r#"
                SELECT *
                FROM measurement_units
                ORDER BY id
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(products)
    }

    pub async fn find_by_id(id: i32, pool: &PgPool) -> Result<MeasurementUnit> {
        let product = sqlx::query_as::<_, MeasurementUnit>(
            r#"
                SELECT * FROM measurement_units WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_one(pool)
        .await?;

        Ok(product)
    }
}

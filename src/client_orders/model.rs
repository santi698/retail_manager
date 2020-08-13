use actix_web::{Error, HttpRequest, HttpResponse, Responder};
use anyhow::Result;
use futures::future::{ready, Ready};
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgQueryAs};
use sqlx::FromRow;

#[derive(Serialize, Deserialize)]
pub struct ClientOrderCreateRequest {
    pub client_id: i32,
    pub order_city_id: i32,
}

#[derive(Serialize, Deserialize)]
pub struct ClientOrderAddItemRequest {
    product_id: i32,
    quantity: f64,
    selling_price: f64,
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
        let orders = sqlx::query_as::<_, ClientOrder>(
            r#"
                SELECT *
                FROM client_orders
                ORDER BY order_id;"#,
        )
        .fetch_all(pool)
        .await?;

        Ok(orders)
    }

    pub async fn find_by_id(id: i32, pool: &PgPool) -> Result<ClientOrder> {
        let order = sqlx::query_as::<_, ClientOrder>(
            r#"
            SELECT *
            FROM client_orders
            WHERE order_id = $1"#,
        )
        .bind(id)
        .fetch_one(pool)
        .await?;
        Ok(order)
    }

    pub async fn create(request: ClientOrderCreateRequest, pool: &PgPool) -> Result<ClientOrder> {
        let order = sqlx::query_as::<_, ClientOrder>(
            r#"
            INSERT INTO client_orders (client_id, order_city_id)
            VALUES ($1, $2)
            RETURNING order_id, client_id, order_city_id"#,
        )
        .bind(request.client_id)
        .bind(request.order_city_id)
        .fetch_one(pool)
        .await?;
        Ok(order)
    }

    pub async fn add_item(
        order_id: i32,
        request: ClientOrderAddItemRequest,
        pool: &PgPool,
    ) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO client_order_items (
                order_timestamp, product_id, client_order_id, quantity, selling_price
            )
            VALUES ($1, $2, $3, $4, $5)
        "#,
        )
        .bind(chrono::Utc::now().naive_utc())
        .bind(request.product_id)
        .bind(order_id)
        .bind(request.quantity)
        .bind(request.selling_price)
        .execute(pool)
        .await?;

        Ok(())
    }
}

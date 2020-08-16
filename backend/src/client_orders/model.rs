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
pub struct ClientOrderUpdateRequest {
    pub ordered_at: chrono::NaiveDateTime,
    pub order_city_id: i32,
    pub order_status: String,
    pub payment_status: String,
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
    pub ordered_at: chrono::NaiveDateTime,
    pub client_id: i32,
    pub order_city_id: i32,
    pub order_status: String,
    pub payment_status: String,
}

#[derive(Serialize, FromRow)]
pub struct ClientOrderWithTotal {
    pub order_id: i32,
    pub client_id: i32,
    pub order_city_id: i32,
    pub order_status: String,
    pub total_price: f64,
}

#[derive(Serialize, FromRow)]
pub struct ClientOrderItem {
    pub client_order_item_id: i32,
    pub product_id: i32,
    pub client_order_id: i32,
    pub quantity: f64,
    pub selling_price: f64,
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
    pub async fn find_all(pool: &PgPool) -> Result<Vec<ClientOrderWithTotal>> {
        let orders = sqlx::query_as::<_, ClientOrderWithTotal>(
            r#"
                SELECT client_orders.*,
                       (
                           SELECT COALESCE(SUM(selling_price), 0)
                             FROM client_order_items
                            WHERE client_order_items.client_order_id =
                                    client_orders.order_id
                       ) AS total_price
                  FROM client_orders
                 ORDER BY order_id;
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(orders)
    }

    pub async fn find_by_id(id: i32, pool: &PgPool) -> Result<ClientOrderWithTotal> {
        let order = sqlx::query_as::<_, ClientOrderWithTotal>(
            r#"
                SELECT client_orders.*,
                       (
                           SELECT COALESCE(SUM(selling_price), 0)
                             FROM client_order_items
                            WHERE client_order_items.client_order_id =
                                    client_orders.order_id
                       ) AS total_price
                  FROM client_orders
                 WHERE order_id = $1
            "#,
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
                RETURNING order_id, ordered_at, client_id, order_city_id, order_status,
                          payment_status
            "#,
        )
        .bind(request.client_id)
        .bind(request.order_city_id)
        .fetch_one(pool)
        .await?;
        Ok(order)
    }

    pub async fn update(
        id: i32,
        request: ClientOrderUpdateRequest,
        pool: &PgPool,
    ) -> Result<ClientOrder> {
        let order = sqlx::query_as::<_, ClientOrder>(
            r#"
                   UPDATE client_orders (client_id, order_city_id)
                      SET ordered_at = $1,
                          order_city_id = $2,
                          order_status = $3,
                          payment_status = $4
                    WHERE id = $5
                RETURNING order_id,
                          ordered_at,
                          client_id,
                          order_city_id,
                          order_status,
                          payment_status
            "#,
        )
        .bind(request.ordered_at)
        .bind(request.order_city_id)
        .bind(request.order_status)
        .bind(request.payment_status)
        .bind(id)
        .fetch_one(pool)
        .await?;
        Ok(order)
    }

    pub async fn find_item(order_id: i32, item_id: i32, pool: &PgPool) -> Result<ClientOrderItem> {
        let item = sqlx::query_as::<_, ClientOrderItem>(
            r#"
              SELECT *
                FROM client_order_items
               WHERE client_order_id = $1 AND client_order_item_id = $2
            "#,
        )
        .bind(order_id)
        .bind(item_id)
        .fetch_one(pool)
        .await?;

        Ok(item)
    }

    pub async fn find_items(order_id: i32, pool: &PgPool) -> Result<Vec<ClientOrderItem>> {
        let items = sqlx::query_as::<_, ClientOrderItem>(
            r#"
            SELECT *
              FROM client_order_items
             WHERE client_order_id = $1
        "#,
        )
        .bind(order_id)
        .fetch_all(pool)
        .await?;

        Ok(items)
    }

    pub async fn add_item(
        order_id: i32,
        request: ClientOrderAddItemRequest,
        pool: &PgPool,
    ) -> Result<ClientOrderItem> {
        let order_item = sqlx::query_as::<_, ClientOrderItem>(
            r#"
            INSERT INTO client_order_items (
                product_id, client_order_id, quantity, selling_price
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING client_order_item_id, product_id, client_order_id,
                      quantity, selling_price
        "#,
        )
        .bind(chrono::Utc::now().naive_utc())
        .bind(request.product_id)
        .bind(order_id)
        .bind(request.quantity)
        .bind(request.selling_price)
        .fetch_one(pool)
        .await?;

        Ok(order_item)
    }

    pub async fn remove_item(order_id: i32, item_id: i32, pool: &PgPool) -> Result<()> {
        sqlx::query(
            r#"
            DELETE FROM client_order_items
             WHERE client_order_item_id = $1
               AND client_order_id = $2
            "#,
        )
        .bind(item_id)
        .bind(order_id)
        .execute(pool)
        .await?;

        Ok(())
    }
}

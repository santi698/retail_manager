use super::{
    ClientOrder, ClientOrderAddItemRequest, ClientOrderCreateRequest, ClientOrderItem,
    ClientOrderRepository, ClientOrderUpdateRequest,
};
use anyhow::Result;
use sqlx::{
    postgres::{PgPool, PgRow},
    Row,
};

pub struct PostgresClientOrderRepository {
    pool: PgPool,
}

impl PostgresClientOrderRepository {
    pub fn new(pool: PgPool) -> Self {
        PostgresClientOrderRepository { pool }
    }
}

fn client_order_from_row(row: PgRow) -> ClientOrder {
    ClientOrder {
        order_id: row
            .try_get("order_id")
            .expect("Error trying to get order_id from row"),
        ordered_at: row
            .try_get("ordered_at")
            .expect("Error trying to get ordered_at from row"),
        client_id: row
            .try_get("client_id")
            .expect("Error trying to get client_id from row"),
        order_city_id: row
            .try_get("order_city_id")
            .expect("Error trying to get order_city_id from row"),
        order_status: row
            .try_get("order_status")
            .expect("Error trying to get order_status from row"),
        payment_status: row
            .try_get("payment_status")
            .expect("Error trying to get payment_status from row"),
        total_price: row
            .try_get("total_price")
            .expect("Error trying to get total_price from row"),
        address: row
            .try_get("address")
            .expect("Error trying to get address from row"),
    }
}

fn client_order_item_from_row(row: PgRow) -> ClientOrderItem {
    ClientOrderItem {
        client_order_item_id: row
            .try_get("client_order_item_id")
            .expect("Error trying to get client_order_item_id from row"),
        product_id: row
            .try_get("product_id")
            .expect("Error trying to get product_id from row"),
        client_order_id: row
            .try_get("client_order_id")
            .expect("Error trying to get client_order_id from row"),
        quantity: row
            .try_get("quantity")
            .expect("Error trying to get quantity from row"),
        selling_price: row
            .try_get("selling_price")
            .expect("Error trying to get selling_price from row"),
    }
}

#[async_trait]
impl ClientOrderRepository for PostgresClientOrderRepository {
    async fn find_all(&self) -> Result<Vec<ClientOrder>> {
        let orders = sqlx::query(
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
        .map(client_order_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(orders)
    }

    async fn find_by_id(&self, id: i32) -> Result<ClientOrder> {
        let order = sqlx::query(
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
        .map(client_order_from_row)
        .fetch_one(&self.pool)
        .await?;
        Ok(order)
    }

    async fn create(&self, request: ClientOrderCreateRequest) -> Result<ClientOrder> {
        let id = sqlx::query(
            r#"
                INSERT INTO client_orders (client_id, order_city_id)
                VALUES ($1, $2)
                RETURNING order_id
            "#,
        )
        .bind(request.client_id)
        .bind(request.order_city_id)
        .map(|row: PgRow| row.get(0))
        .fetch_one(&self.pool)
        .await?;

        let new_order = self.find_by_id(id).await?;
        Ok(new_order)
    }

    async fn update(&self, id: i32, request: ClientOrderUpdateRequest) -> Result<ClientOrder> {
        sqlx::query(
            r#"
                   UPDATE client_orders (client_id, order_city_id)
                      SET ordered_at = $1,
                          order_city_id = $2,
                          order_status = $3,
                          payment_status = $4
                    WHERE id = $5
            "#,
        )
        .bind(request.ordered_at)
        .bind(request.order_city_id)
        .bind(request.order_status)
        .bind(request.payment_status)
        .bind(id)
        .execute(&self.pool)
        .await?;

        let order_after = self.find_by_id(id).await?;

        Ok(order_after)
    }

    async fn find_item(&self, order_id: i32, item_id: i32) -> Result<ClientOrderItem> {
        let item = sqlx::query(
            r#"
              SELECT *
                FROM client_order_items
               WHERE client_order_id = $1 AND client_order_item_id = $2
            "#,
        )
        .bind(order_id)
        .bind(item_id)
        .map(client_order_item_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(item)
    }

    async fn find_items(&self, order_id: i32) -> Result<Vec<ClientOrderItem>> {
        let items = sqlx::query(
            r#"
            SELECT *
              FROM client_order_items
             WHERE client_order_id = $1
        "#,
        )
        .bind(order_id)
        .map(client_order_item_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(items)
    }

    async fn add_item(
        &self,
        order_id: i32,
        request: ClientOrderAddItemRequest,
    ) -> Result<ClientOrderItem> {
        let order_item = sqlx::query(
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
        .map(client_order_item_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(order_item)
    }

    async fn remove_item(&self, order_id: i32, item_id: i32) -> Result<()> {
        sqlx::query(
            r#"
            DELETE FROM client_order_items
             WHERE client_order_item_id = $1
               AND client_order_id = $2
            "#,
        )
        .bind(item_id)
        .bind(order_id)
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}

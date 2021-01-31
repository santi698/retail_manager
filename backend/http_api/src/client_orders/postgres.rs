use crate::types;

use domain::{
    ClientOrder, ClientOrderAddItemRequest, ClientOrderCreateRequest, ClientOrderItem,
    ClientOrderRepository, ClientOrderUpdateRequest,
};
use sqlx::{
    postgres::{PgPool, PgRow},
    Row,
};
use types::RepositoryError;

#[derive(Debug)]
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
        account_id: row
            .try_get("account_id")
            .expect("Error trying to get account_id from row"),
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
        account_id: row
            .try_get("account_id")
            .expect("Error trying to get account_id from row"),
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
    type Error = RepositoryError;

    #[tracing::instrument(name = "client_order_repository.find_all", skip(self))]
    async fn find_all(&self, account_id: i32) -> Result<Vec<ClientOrder>, Self::Error> {
        let orders = sqlx::query(
            r#"
                SELECT client_orders.*,
                       (
                           SELECT COALESCE(SUM(selling_price), 0)
                             FROM client_order_items
                            WHERE account_id = $1
                              AND client_order_items.client_order_id = client_orders.order_id
                       ) AS total_price
                  FROM client_orders
                  WHERE account_id = $1
                 ORDER BY order_id;
            "#,
        )
        .bind(account_id)
        .map(client_order_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(orders)
    }

    #[tracing::instrument(name = "client_order_repository.find_by_id", skip(self))]
    async fn find_by_id(&self, account_id: i32, id: i32) -> Result<ClientOrder, Self::Error> {
        let order = sqlx::query(
            r#"
                SELECT client_orders.*,
                       (
                           SELECT COALESCE(SUM(selling_price), 0)
                             FROM client_order_items
                            WHERE account_id = $1
                              AND client_order_items.client_order_id = client_orders.order_id
                       ) AS total_price
                  FROM client_orders
                  WHERE account_id = $1
                    AND   order_id = $2
            "#,
        )
        .bind(account_id)
        .bind(id)
        .map(client_order_from_row)
        .fetch_one(&self.pool)
        .await?;
        Ok(order)
    }

    #[tracing::instrument(name = "client_order_repository.create", skip(self))]
    async fn create(
        &self,
        account_id: i32,
        request: ClientOrderCreateRequest,
    ) -> Result<ClientOrder, Self::Error> {
        let id = sqlx::query(
            r#"
                INSERT INTO client_orders (account_id, client_id, order_city_id)
                VALUES ($1, $2, $3)
                RETURNING order_id
            "#,
        )
        .bind(account_id)
        .bind(request.client_id)
        .bind(request.order_city_id)
        .map(|row: PgRow| row.get(0))
        .fetch_one(&self.pool)
        .await?;

        let new_order = self.find_by_id(account_id, id).await?;
        Ok(new_order)
    }

    #[tracing::instrument(name = "client_order_repository.update", skip(self))]
    async fn update(
        &self,
        account_id: i32,
        id: i32,
        request: ClientOrderUpdateRequest,
    ) -> Result<ClientOrder, Self::Error> {
        sqlx::query(
            r#"
                   UPDATE client_orders
                      SET order_city_id = $1,
                          order_status = $2,
                          payment_status = $3
                    WHERE account_id = $4
                      AND order_id = $5
            "#,
        )
        .bind(request.order_city_id)
        .bind(request.order_status.as_ref())
        .bind(request.payment_status)
        .bind(account_id)
        .bind(id)
        .execute(&self.pool)
        .await?;

        let order_after = self.find_by_id(account_id, id).await?;

        Ok(order_after)
    }

    #[tracing::instrument(name = "client_order_repository.find_item", skip(self))]
    async fn find_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> Result<ClientOrderItem, Self::Error> {
        let item = sqlx::query(
            r#"
              SELECT *
                FROM client_order_items
               WHERE account_id = $1
                 AND client_order_id = $2
                 AND client_order_item_id = $3
            "#,
        )
        .bind(account_id)
        .bind(order_id)
        .bind(item_id)
        .map(client_order_item_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(item)
    }

    #[tracing::instrument(name = "client_order_repository.find_items", skip(self))]
    async fn find_items(
        &self,
        account_id: i32,
        order_id: i32,
    ) -> Result<Vec<ClientOrderItem>, Self::Error> {
        let items = sqlx::query(
            r#"
            SELECT *
              FROM client_order_items
             WHERE account_id = $1
               AND client_order_id = $2
        "#,
        )
        .bind(account_id)
        .bind(order_id)
        .map(client_order_item_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(items)
    }

    #[tracing::instrument(name = "client_order_repository.add_item", skip(self))]
    async fn add_item(
        &self,
        account_id: i32,
        order_id: i32,
        request: ClientOrderAddItemRequest,
    ) -> Result<ClientOrderItem, Self::Error> {
        let order_item = sqlx::query(
            r#"
            INSERT INTO client_order_items (
                account_id, product_id, client_order_id, quantity, selling_price
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING account_id, client_order_item_id, product_id, client_order_id,
                      quantity, selling_price
        "#,
        )
        .bind(account_id)
        .bind(request.product_id)
        .bind(order_id)
        .bind(request.quantity)
        .bind(request.selling_price)
        .map(client_order_item_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(order_item)
    }

    #[tracing::instrument(name = "client_order_repository.remove_item", skip(self))]
    async fn remove_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> Result<(), Self::Error> {
        sqlx::query(
            r#"
            DELETE FROM client_order_items
             WHERE account_id = $1
               AND client_order_item_id = $2
               AND client_order_id = $3
            "#,
        )
        .bind(account_id)
        .bind(item_id)
        .bind(order_id)
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}

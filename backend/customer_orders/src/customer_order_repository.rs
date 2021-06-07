pub use crate::models::{
    CustomerOrder, CustomerOrderAddItemRequest, CustomerOrderCreateRequest, CustomerOrderItem,
    CustomerOrderRepository, CustomerOrderUpdateRequest,
};
pub use crate::types::OrderStatus;
use async_trait::async_trait;
use domain::RepositoryError;
use sqlx::{
    postgres::{PgPool, PgRow},
    Row,
};

#[derive(Debug)]
pub struct PostgresCustomerOrderRepository {
    pool: PgPool,
}

impl PostgresCustomerOrderRepository {
    pub fn new(pool: PgPool) -> Self {
        PostgresCustomerOrderRepository { pool }
    }
}

fn customer_order_from_row(row: PgRow) -> CustomerOrder {
    CustomerOrder {
        account_id: row
            .try_get("account_id")
            .expect("Error trying to get account_id from row"),
        order_id: row
            .try_get("order_id")
            .expect("Error trying to get order_id from row"),
        ordered_at: row
            .try_get("ordered_at")
            .expect("Error trying to get ordered_at from row"),
        customer_id: row
            .try_get("customer_id")
            .expect("Error trying to get customer_id from row"),
        order_city_id: row
            .try_get("order_city_id")
            .expect("Error trying to get order_city_id from row"),
        order_status: row
            .try_get("order_status")
            .expect("Error trying to get order_status from row"),
        total_price: row
            .try_get("total_price")
            .expect("Error trying to get total_price from row"),
        address: row
            .try_get("address")
            .expect("Error trying to get address from row"),
    }
}

fn customer_order_item_from_row(row: PgRow) -> CustomerOrderItem {
    CustomerOrderItem {
        customer_order_item_id: row
            .try_get("customer_order_item_id")
            .expect("Error trying to get customer_order_item_id from row"),
        account_id: row
            .try_get("account_id")
            .expect("Error trying to get account_id from row"),
        product_id: row
            .try_get("product_id")
            .expect("Error trying to get product_id from row"),
        customer_order_id: row
            .try_get("customer_order_id")
            .expect("Error trying to get customer_order_id from row"),
        quantity: row
            .try_get("quantity")
            .expect("Error trying to get quantity from row"),
        selling_price: row
            .try_get("selling_price")
            .expect("Error trying to get selling_price from row"),
    }
}

#[async_trait]
impl CustomerOrderRepository for PostgresCustomerOrderRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "customer_order_repository.find_all", skip(self))]
    async fn find_all(&self, account_id: i32) -> Result<Vec<CustomerOrder>, Self::Error> {
        let orders = sqlx::query(
            r#"
                SELECT customer_orders.*,
                       (
                           SELECT COALESCE(SUM(selling_price), 0)
                             FROM customer_order_items
                            WHERE account_id = $1
                              AND customer_order_items.customer_order_id = customer_orders.order_id
                       ) AS total_price
                  FROM customer_orders
                  WHERE account_id = $1
                  ORDER BY customer_orders.ordered_at DESC
            "#,
        )
        .bind(account_id)
        .map(customer_order_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(orders)
    }

    #[tracing::instrument(name = "customer_order_repository.find_by_id", skip(self))]
    async fn find_by_id(&self, account_id: i32, id: i32) -> Result<CustomerOrder, Self::Error> {
        let order = sqlx::query(
            r#"
                SELECT customer_orders.*,
                       (
                           SELECT COALESCE(SUM(selling_price), 0)
                             FROM customer_order_items
                            WHERE account_id = $1
                              AND customer_order_items.customer_order_id = customer_orders.order_id
                       ) AS total_price
                  FROM customer_orders
                  WHERE account_id = $1
                    AND   order_id = $2
            "#,
        )
        .bind(account_id)
        .bind(id)
        .map(customer_order_from_row)
        .fetch_one(&self.pool)
        .await?;
        Ok(order)
    }

    #[tracing::instrument(name = "customer_order_repository.create", skip(self))]
    async fn create(
        &self,
        account_id: i32,
        request: CustomerOrderCreateRequest,
    ) -> Result<CustomerOrder, Self::Error> {
        let id = sqlx::query(
            r#"
                INSERT INTO customer_orders (account_id, customer_id, order_city_id)
                VALUES ($1, $2, $3)
                RETURNING order_id
            "#,
        )
        .bind(account_id)
        .bind(request.customer_id)
        .bind(request.order_city_id)
        .map(|row: PgRow| row.get(0))
        .fetch_one(&self.pool)
        .await?;

        let new_order = self.find_by_id(account_id, id).await?;
        Ok(new_order)
    }

    #[tracing::instrument(name = "customer_order_repository.update", skip(self))]
    async fn update(
        &self,
        account_id: i32,
        id: i32,
        request: CustomerOrderUpdateRequest,
    ) -> Result<CustomerOrder, Self::Error> {
        sqlx::query(
            r#"
                   UPDATE customer_orders
                      SET order_city_id = $1,
                          order_status = $2
                    WHERE account_id = $3
                      AND order_id = $4
            "#,
        )
        .bind(request.order_city_id)
        .bind(request.order_status.as_ref())
        .bind(account_id)
        .bind(id)
        .execute(&self.pool)
        .await?;

        let order_after = self.find_by_id(account_id, id).await?;

        Ok(order_after)
    }

    #[tracing::instrument(name = "customer_order_repository.find_item", skip(self))]
    async fn find_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> Result<CustomerOrderItem, Self::Error> {
        let item = sqlx::query(
            r#"
              SELECT *
                FROM customer_order_items
               WHERE account_id = $1
                 AND customer_order_id = $2
                 AND customer_order_item_id = $3
            "#,
        )
        .bind(account_id)
        .bind(order_id)
        .bind(item_id)
        .map(customer_order_item_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(item)
    }

    #[tracing::instrument(name = "customer_order_repository.find_items", skip(self))]
    async fn find_items(
        &self,
        account_id: i32,
        order_id: i32,
    ) -> Result<Vec<CustomerOrderItem>, Self::Error> {
        let items = sqlx::query(
            r#"
            SELECT *
              FROM customer_order_items
             WHERE account_id = $1
               AND customer_order_id = $2
             ORDER BY customer_order_items.customer_order_item_id
        "#,
        )
        .bind(account_id)
        .bind(order_id)
        .map(customer_order_item_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(items)
    }

    #[tracing::instrument(name = "customer_order_repository.add_item", skip(self))]
    async fn add_item(
        &self,
        account_id: i32,
        order_id: i32,
        request: CustomerOrderAddItemRequest,
    ) -> Result<CustomerOrderItem, Self::Error> {
        let order_item = sqlx::query(
            r#"
            INSERT INTO customer_order_items (
                account_id, product_id, customer_order_id, quantity, selling_price
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        "#,
        )
        .bind(account_id)
        .bind(request.product_id)
        .bind(order_id)
        .bind(request.quantity)
        .bind(request.selling_price)
        .map(customer_order_item_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(order_item)
    }

    #[tracing::instrument(name = "customer_order_repository.remove_item", skip(self))]
    async fn remove_item(
        &self,
        account_id: i32,
        order_id: i32,
        item_id: i32,
    ) -> Result<(), Self::Error> {
        sqlx::query(
            r#"
            DELETE FROM customer_order_items
             WHERE account_id = $1
               AND customer_order_item_id = $2
               AND customer_order_id = $3
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

use std::convert::TryInto;

use sqlx::postgres::{PgPool, PgRow};
use sqlx::Row;
use types::RepositoryError;

use crate::types;

use customers::{Customer, CustomerCreateRequest, CustomerRepository, CustomerUpdateRequest};
use domain::{Email, PhoneNumber};

#[derive(Debug)]
pub struct PostgresCustomerRepository {
    pool: PgPool,
}

impl PostgresCustomerRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl CustomerRepository for PostgresCustomerRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "customer_repository.find_all", skip(self))]
    async fn find_all(&self, account_id: i32) -> Result<Vec<Customer>, Self::Error> {
        let customers = sqlx::query(
            r#"
                SELECT *
                FROM customers
                WHERE account_id = $1
                ORDER BY customer_id;
            "#,
        )
        .bind(account_id)
        .map(customer_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(customers)
    }

    #[tracing::instrument(name = "customer_repository.find_by_id", skip(self))]
    async fn find_by_id(&self, account_id: i32, customer_id: i32) -> Result<Customer, Self::Error> {
        let customer = sqlx::query(
            r#"
                SELECT *
                FROM customers
                WHERE account_id = $1
                  AND customer_id = $2
            "#,
        )
        .bind(account_id)
        .bind(customer_id)
        .map(customer_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(customer)
    }

    #[tracing::instrument(name = "customer_repository.create", skip(self))]
    async fn create(
        &self,
        account_id: i32,
        request: CustomerCreateRequest,
    ) -> Result<Customer, Self::Error> {
        let customer = sqlx::query(
            r#"
                INSERT INTO customers (
                    account_id,
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    residence_city_id,
                    address
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            "#,
        )
        .bind(account_id)
        .bind(&request.first_name)
        .bind(&request.last_name)
        .bind(&request.email)
        .bind(&request.phone_number)
        .bind(&request.residence_city_id)
        .bind(&request.address)
        .map(customer_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(customer)
    }

    #[tracing::instrument(name = "customer_repository.update", skip(self))]
    async fn update(
        &self,
        account_id: i32,
        customer_id: i32,
        request: CustomerUpdateRequest,
    ) -> Result<Customer, Self::Error> {
        let customer = sqlx::query(
            r#"
                UPDATE customers
                SET first_name = $1,
                    last_name = $2,
                    email = $3,
                    phone_number = $4,
                    residence_city_id = $5,
                    address = $6
                WHERE account_id = $7
                  AND  customer_id = $8
                RETURNING *
            "#,
        )
        .bind(&request.first_name)
        .bind(&request.last_name)
        .bind(&request.email)
        .bind(&request.phone_number)
        .bind(&request.residence_city_id)
        .bind(&request.address)
        .bind(account_id)
        .bind(customer_id)
        .map(customer_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(customer)
    }
}

fn customer_from_row(row: PgRow) -> Customer {
    let email_str: Option<String> = row.get("email");
    let email: Option<Email> = email_str.map(|s| s.try_into().expect("Invalid email"));
    let phone_number_str: Option<String> = row.get("phone_number");
    let phone_number: Option<PhoneNumber> =
        phone_number_str.map(|n| n.try_into().expect("Invalid phone number"));
    Customer {
        account_id: row.get("account_id"),
        customer_id: row.get("customer_id"),
        first_name: row.get("first_name"),
        last_name: row.get("last_name"),
        email,
        phone_number,
        residence_city_id: row.get("residence_city_id"),
        address: row.get("address"),
    }
}

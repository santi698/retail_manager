use async_trait::async_trait;
use sqlx::{postgres::PgRow, PgPool, Row};

use crate::{City, CityRepository, RepositoryError};

fn city_from_row(row: PgRow) -> City {
    City {
        id: row.try_get("id").expect("Error getting city id from row"),
        account_id: row
            .try_get("account_id")
            .expect("Error getting account_id from row"),
        name: row
            .try_get("name")
            .expect("Error getting city name from row"),
    }
}

#[derive(Clone, Debug)]
pub struct PostgresCityRepository {
    pool: PgPool,
}

impl PostgresCityRepository {
    pub fn new(pool: PgPool) -> PostgresCityRepository {
        PostgresCityRepository { pool }
    }
}

#[async_trait]
impl CityRepository for PostgresCityRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "city_repository.find_all", skip(self))]
    async fn find_all(&self, account_id: i32) -> Result<Vec<City>, Self::Error> {
        let products = sqlx::query(
            r#"
                SELECT *
                FROM cities
                WHERE account_id = $1
                ORDER BY id
            "#,
        )
        .bind(account_id)
        .map(city_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(products)
    }

    #[tracing::instrument(name = "city_repository.find_by_id", skip(self))]
    async fn find_by_id(&self, account_id: i32, id: i32) -> Result<City, Self::Error> {
        let product = sqlx::query(
            r#"
                SELECT * FROM cities WHERE account_id = $1 AND id = $2
            "#,
        )
        .bind(account_id)
        .bind(id)
        .map(city_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(product)
    }

    async fn create(
        &self,
        account_id: i32,
        request: crate::CityCreateRequest,
    ) -> Result<City, Self::Error> {
        let city = sqlx::query(
            r#"
                INSERT INTO cities(account_id, name)
                VALUES ($1, $2)
                RETURNING cities.*
            "#,
        )
        .bind(account_id)
        .bind(request.name)
        .map(city_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(city)
    }
}

use sqlx::{postgres::PgRow, PgPool, Row};

use crate::types;

use super::{City, CityRepository};

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

#[derive(Clone)]
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
    async fn find_all(&self, account_id: i32) -> types::RepositoryResult<Vec<City>> {
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

    async fn find_by_id(&self, account_id: i32, id: i32) -> types::RepositoryResult<City> {
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
}

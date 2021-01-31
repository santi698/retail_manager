use crate::types::RepositoryError;
use domain::{MeasurementUnit, MeasurementUnitRepository};
use sqlx::{postgres::PgRow, PgPool, Row};

fn measurement_unit_from_row(row: PgRow) -> MeasurementUnit {
    MeasurementUnit {
        id: row.get("id"),
        unit_name: row.get("unit_name"),
        symbol: row.get("symbol"),
    }
}

#[derive(Debug)]
pub struct PostgresMeasurementUnitRepository {
    pool: PgPool,
}

impl PostgresMeasurementUnitRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl MeasurementUnitRepository for PostgresMeasurementUnitRepository {
    type Error = RepositoryError;

    #[tracing::instrument(name = "measurement_unit_repository.find_by_id", skip(self))]
    async fn find_all(&self) -> Result<Vec<MeasurementUnit>, Self::Error> {
        let products = sqlx::query(
            r#"
                SELECT *
                FROM measurement_units
                ORDER BY id
            "#,
        )
        .map(measurement_unit_from_row)
        .fetch_all(&self.pool)
        .await?;

        Ok(products)
    }

    #[tracing::instrument(name = "measurement_unit_repository.find_all", skip(self))]
    async fn find_by_id(&self, id: i32) -> Result<MeasurementUnit, Self::Error> {
        let product = sqlx::query(
            r#"
                SELECT * FROM measurement_units WHERE id = $1
            "#,
        )
        .bind(id)
        .map(measurement_unit_from_row)
        .fetch_one(&self.pool)
        .await?;

        Ok(product)
    }
}

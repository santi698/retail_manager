use super::{MeasurementUnit, MeasurementUnitRepository};
use anyhow::Result;
use sqlx::{postgres::PgRow, PgPool, Row};

fn measurement_unit_from_row(row: PgRow) -> MeasurementUnit {
    MeasurementUnit {
        id: row.get("id"),
        unit_name: row.get("unit_name"),
        symbol: row.get("symbol"),
    }
}

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
    async fn find_all(&self) -> Result<Vec<MeasurementUnit>> {
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

    async fn find_by_id(&self, id: i32) -> Result<MeasurementUnit> {
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

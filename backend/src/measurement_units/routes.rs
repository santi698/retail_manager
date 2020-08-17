use super::MeasurementUnit;
use actix_web::{get, web, HttpResponse, Responder};
use log::error;
use sqlx::PgPool;

#[get("/measurement_units")]
async fn find_all(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = MeasurementUnit::find_all(&db_pool).await;

    match result {
        Ok(measurement_units) => HttpResponse::Ok().json(measurement_units),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest()
                .body("Error trying to read all measurement units from the database")
        }
    }
}

#[get("/measurement_units/{id}")]
async fn find_by_id(id: web::Path<i32>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = MeasurementUnit::find_by_id(id.into_inner(), db_pool.get_ref()).await;

    match result {
        Ok(measurement_unit) => HttpResponse::Ok().json(measurement_unit),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("MeasurementUnit not found")
        }
    }
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
}

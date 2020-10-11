use crate::AppContext;

use actix_web::{get, web, HttpResponse, Responder};
use log::error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
}

#[get("/measurement_units")]
async fn find_all(context: web::Data<AppContext>) -> impl Responder {
    let result = context.measurement_unit_repository.find_all().await;

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
async fn find_by_id(id: web::Path<i32>, context: web::Data<AppContext>) -> impl Responder {
    let result = context
        .measurement_unit_repository
        .find_by_id(id.into_inner())
        .await;

    match result {
        Ok(measurement_unit) => HttpResponse::Ok().json(measurement_unit),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("MeasurementUnit not found")
        }
    }
}

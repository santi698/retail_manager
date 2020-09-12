use crate::AppContext;

use super::MeasurementUnit;
use actix_web::{get, web, Error, HttpRequest, HttpResponse, Responder};
use futures::{future::ready, future::Ready};
use log::error;

impl Responder for MeasurementUnit {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        // create response and set content type
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
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

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
}

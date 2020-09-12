use crate::AppContext;

use super::City;
use actix_web::{get, web, HttpResponse, Responder};
use actix_web::{Error, HttpRequest};
use futures::future::{ready, Ready};
use log::error;

impl Responder for City {
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

#[get("/cities")]
async fn find_all(context: web::Data<AppContext>) -> impl Responder {
    let result = context.city_repository.find_all().await;

    match result {
        Ok(orders) => HttpResponse::Ok().json(orders),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("Error trying to read all cities from the database")
        }
    }
}

#[get("/cities/{id}")]
async fn find_by_id(id: web::Path<i32>, context: web::Data<AppContext>) -> impl Responder {
    let result = context.city_repository.find_by_id(id.into_inner()).await;

    match result {
        Ok(order) => HttpResponse::Ok().json(order),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("City not found")
        }
    }
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
}

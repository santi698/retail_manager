use crate::AppContext;

use actix_web::{get, web, HttpResponse, Responder};
use log::error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
}

#[get("/cities")]
async fn find_all(context: web::Data<AppContext>) -> impl Responder {
    let result = context.city_repository.find_all().await;

    match result {
        Ok(cities) => HttpResponse::Ok().json(cities),
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
        Ok(city) => HttpResponse::Ok().json(city),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("City not found")
        }
    }
}

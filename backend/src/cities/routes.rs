use super::City;
use actix_web::{get, web, HttpResponse, Responder};
use log::error;
use sqlx::PgPool;

#[get("/cities")]
async fn find_all(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = City::find_all(&db_pool).await;

    match result {
        Ok(orders) => HttpResponse::Ok().json(orders),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("Error trying to read all cities from the database")
        }
    }
}

#[get("/cities/{id}")]
async fn find_by_id(id: web::Path<i32>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = City::find_by_id(id.into_inner(), db_pool.get_ref()).await;

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

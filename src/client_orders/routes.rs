use crate::client_orders::{ClientOrder};
use sqlx::PgPool;
use actix_web::{get, web, Responder, HttpResponse};

#[get("/client_orders")]
async fn find_all(db_pool: web::Data<PgPool>) -> impl Responder {
  let result = ClientOrder::find_all(&db_pool).await;

  match result {
    Ok(orders) => HttpResponse::Ok().json(orders),
    Err(_) => HttpResponse::BadRequest().body("Error trying to read all orders from the database")
  }
}

pub fn init(cfg: &mut web::ServiceConfig) {
  cfg.service(find_all);
}

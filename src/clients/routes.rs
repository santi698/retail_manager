use crate::clients::{Client, ClientCreateRequest};
use actix_web::{get, post, web, HttpResponse, Responder};
use sqlx::PgPool;

#[get("/clients")]
async fn find_all(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = Client::find_all(db_pool.get_ref()).await;
    match result {
        Ok(clients) => HttpResponse::Ok().json(clients),
        _ => HttpResponse::BadRequest().body("Error trying to read all clients from database"),
    }
}

#[get("/clients/{client_id}")]
async fn find_by_id(client_id: web::Path<i32>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = Client::find_by_id(client_id.into_inner(), db_pool.get_ref()).await;
    match result {
        Ok(client) => HttpResponse::Ok().json(client),
        _ => HttpResponse::BadRequest().body("Client not found"),
    }
}

#[post("/clients")]
async fn create(request: web::Json<ClientCreateRequest>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = Client::create(request.into_inner(), db_pool.get_ref()).await;
    match result {
        Ok(clients) => HttpResponse::Ok().json(clients),
        Err(e) => {
          error!("{}", e);
          HttpResponse::BadRequest().body("Error trying create a new client")
        },
    }
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
    cfg.service(create);
}

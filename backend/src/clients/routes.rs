use crate::{clients::ClientCreateRequest, AppContext};

use actix_web::{get, post, put, web, HttpResponse, Responder};
use log::error;

use super::ClientUpdateRequest;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
    cfg.service(create);
    cfg.service(update);
}

#[get("/clients")]
async fn find_all(context: web::Data<AppContext>) -> impl Responder {
    let result = context.client_repository.find_all().await;
    match result {
        Ok(clients) => HttpResponse::Ok().json(clients),
        _ => HttpResponse::BadRequest().body("Error trying to read all clients from database"),
    }
}

#[get("/clients/{client_id}")]
async fn find_by_id(client_id: web::Path<i32>, context: web::Data<AppContext>) -> impl Responder {
    let result = context
        .client_repository
        .find_by_id(client_id.into_inner())
        .await;
    match result {
        Ok(client) => HttpResponse::Ok().json(client),
        _ => HttpResponse::BadRequest().body("Client not found"),
    }
}

#[post("/clients")]
async fn create(
    request: web::Json<ClientCreateRequest>,
    context: web::Data<AppContext>,
) -> impl Responder {
    let result = context.client_repository.create(request.into_inner()).await;
    match result {
        Ok(clients) => HttpResponse::Ok().json(clients),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("Error trying create a new client")
        }
    }
}

#[put("/clients/{client_id}")]
async fn update(
    client_id: web::Path<i32>,
    request: web::Json<ClientUpdateRequest>,
    context: web::Data<AppContext>,
) -> impl Responder {
    let result = context
        .client_repository
        .update(client_id.into_inner(), request.into_inner())
        .await;
    match result {
        Ok(client) => HttpResponse::Ok().json(client),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("Error trying to update client")
        }
    }
}

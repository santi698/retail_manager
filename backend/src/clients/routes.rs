use crate::{
    clients::{Client, ClientCreateRequest},
    AppContext,
};

use actix_web::{get, post, web, HttpResponse, Responder};
use actix_web::{Error, HttpRequest};
use anyhow::Result;
use futures::future::{ready, Ready};
use log::error;

impl Responder for Client {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;
    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
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

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
    cfg.service(create);
}

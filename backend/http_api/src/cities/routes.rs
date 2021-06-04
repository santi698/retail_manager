use crate::{auth::JwtClaim, AppContext};

use actix_web::{get, post, web, HttpResponse, Responder};
use domain::CityCreateRequest;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
    cfg.service(create);
}

#[get("/cities")]
async fn find_all(context: web::Data<AppContext>, claims: JwtClaim) -> impl Responder {
    let result = context
        .city_repository
        .find_all(claims.user_account_id)
        .await;

    match result {
        Ok(cities) => HttpResponse::Ok().json(cities),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error trying to read all cities from the database")
        }
    }
}

#[get("/cities/{id}")]
async fn find_by_id(
    id: web::Path<i32>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .city_repository
        .find_by_id(claims.user_account_id, id.into_inner())
        .await;

    match result {
        Ok(city) => HttpResponse::Ok().json(city),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("City not found")
        }
    }
}

#[post("/cities")]
async fn create(
    request: web::Json<CityCreateRequest>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .city_repository
        .create(claims.user_account_id, request.into_inner())
        .await;

    match result {
        Ok(city) => HttpResponse::Created().json(city),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("City could not be created")
        }
    }
}

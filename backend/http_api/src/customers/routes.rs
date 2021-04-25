use crate::{auth::JwtClaim, AppContext};

use actix_web::{get, post, put, web, HttpResponse, Responder};

use customer_orders::{CustomerCreateRequest, CustomerUpdateRequest};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
    cfg.service(create);
    cfg.service(update);
}

#[get("/customers")]
async fn find_all(context: web::Data<AppContext>, claims: JwtClaim) -> impl Responder {
    let result = context
        .customer_repository
        .find_all(claims.user_account_id)
        .await;
    match result {
        Ok(customers) => HttpResponse::Ok().json(customers),
        _ => HttpResponse::BadRequest().body("Error trying to read all customers from database"),
    }
}

#[get("/customers/{customer_id}")]
async fn find_by_id(
    customer_id: web::Path<i32>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .customer_repository
        .find_by_id(claims.user_account_id, customer_id.into_inner())
        .await;
    match result {
        Ok(customer) => HttpResponse::Ok().json(customer),
        _ => HttpResponse::BadRequest().body("Customer not found"),
    }
}

#[post("/customers")]
async fn create(
    request: web::Json<CustomerCreateRequest>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .customer_repository
        .create(claims.user_account_id, request.into_inner())
        .await;
    match result {
        Ok(customer) => HttpResponse::Ok().json(customer),
        Err(e) => {
            tracing::error!("{:?}", e);
            HttpResponse::BadRequest().body("Error trying create a new customer")
        }
    }
}

#[put("/customers/{customer_id}")]
async fn update(
    customer_id: web::Path<i32>,
    request: web::Json<CustomerUpdateRequest>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .customer_repository
        .update(
            claims.user_account_id,
            customer_id.into_inner(),
            request.into_inner(),
        )
        .await;
    match result {
        Ok(customer) => HttpResponse::Ok().json(customer),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error trying to update customer")
        }
    }
}

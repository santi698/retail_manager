use std::convert::TryFrom;

use crate::{auth::JwtClaim, types::ErrorJson, AppContext};

use super::{ClientOrderAddItemRequest, ClientOrderCreateRequest, ClientOrderUpdateRequest};
use actix_web::{delete, get, post, put, web, HttpResponse, Responder};
use serde::Deserialize;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
    cfg.service(create);
    cfg.service(update);
    cfg.service(find_items);
    cfg.service(find_item);
    cfg.service(add_item);
    cfg.service(remove_item);
}

#[get("/client_orders")]
async fn find_all(context: web::Data<AppContext>, claims: JwtClaim) -> impl Responder {
    let result = context
        .client_order_repository
        .find_all(claims.user_account_id)
        .await;

    match result {
        Ok(orders) => HttpResponse::Ok().json(orders),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error trying to read all orders from the database")
        }
    }
}

#[get("/client_orders/{order_id}")]
async fn find_by_id(
    order_id: web::Path<i32>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .client_order_repository
        .find_by_id(claims.user_account_id, order_id.into_inner())
        .await;

    match result {
        Ok(order) => HttpResponse::Ok().json(order),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("ClientOrder not found")
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct ClientOrderUpdateJson {
    pub order_city_id: i32,
    pub order_status: String,
    pub payment_status: String,
}

#[put("/client_orders/{order_id}")]
async fn update(
    order_id: web::Path<i32>,
    request: web::Json<ClientOrderUpdateJson>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> Result<HttpResponse, HttpResponse> {
    let request = ClientOrderUpdateRequest::try_from(request.into_inner())
        .map_err(|error| HttpResponse::BadRequest().json(ErrorJson { error }))?;
    let result = context
        .client_order_repository
        .update(claims.user_account_id, order_id.into_inner(), request)
        .await;

    match result {
        Ok(order) => Ok(HttpResponse::Ok().json(order)),
        Err(e) => {
            tracing::error!("{}", e);
            Err(HttpResponse::BadRequest().body("ClientOrder not found"))
        }
    }
}

#[post("/client_orders")]
async fn create(
    request: web::Json<ClientOrderCreateRequest>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .client_order_repository
        .create(claims.user_account_id, request.into_inner())
        .await;

    match result {
        Ok(order) => HttpResponse::Ok().json(order),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error creating order")
        }
    }
}

#[derive(Deserialize)]
struct FindItemPathParams {
    pub order_id: i32,
    pub item_id: i32,
}

#[get("/client_orders/{order_id}/items/{item_id}")]
async fn find_item(
    params: web::Path<FindItemPathParams>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .client_order_repository
        .find_item(claims.user_account_id, params.order_id, params.item_id)
        .await;

    match result {
        Ok(item) => HttpResponse::Ok().json(item),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error fetching order items")
        }
    }
}

#[get("/client_orders/{order_id}/items")]
async fn find_items(
    order_id: web::Path<i32>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .client_order_repository
        .find_items(claims.user_account_id, order_id.into_inner())
        .await;

    match result {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error fetching order items")
        }
    }
}

#[post("/client_orders/{order_id}/items")]
async fn add_item(
    order_id: web::Path<i32>,
    request: web::Json<ClientOrderAddItemRequest>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .client_order_repository
        .add_item(
            claims.user_account_id,
            order_id.into_inner(),
            request.into_inner(),
        )
        .await;

    match result {
        Ok(item) => HttpResponse::Ok().json(item),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error adding item to order")
        }
    }
}

#[derive(Deserialize)]
struct RemoveItemPathParams {
    pub order_id: i32,
    pub item_id: i32,
}

#[delete("/client_orders/{order_id}/items/{item_id}")]
async fn remove_item(
    params: web::Path<RemoveItemPathParams>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .client_order_repository
        .remove_item(claims.user_account_id, params.order_id, params.item_id)
        .await;

    match result {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error removing item from order")
        }
    }
}

use crate::{auth::JwtClaim, AppContext};

use actix_web::{delete, get, post, put, web, HttpResponse, Responder};
use inventory::{ProductCreateRequest, ProductUpdateRequest};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find);
    cfg.service(create);
    cfg.service(update);
    cfg.service(delete);
}

#[get("/products")]
async fn find_all(context: web::Data<AppContext>, claims: JwtClaim) -> impl Responder {
    let result = context
        .product_repository
        .find_all(claims.user_account_id)
        .await;
    match result {
        Ok(products) => HttpResponse::Ok().json(products),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("Error trying to read all products from database")
        }
    }
}

#[get("/products/{product_code}")]
async fn find(
    product_code: web::Path<i32>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .product_repository
        .find_by_code(claims.user_account_id, product_code.into_inner())
        .await;
    match result {
        Ok(product) => HttpResponse::Ok().json(product),
        _ => HttpResponse::BadRequest().body("Product not found"),
    }
}

#[post("/products")]
async fn create(
    product: web::Json<ProductCreateRequest>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .product_repository
        .create(claims.user_account_id, product.into_inner())
        .await;
    match result {
        Ok(product) => HttpResponse::Ok().json(product),
        _ => HttpResponse::BadRequest().body("Error trying to create new product {}"),
    }
}

#[put("/products/{product_code}")]
async fn update(
    product_code: web::Path<i32>,
    product: web::Json<ProductUpdateRequest>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .product_repository
        .update(
            claims.user_account_id,
            product_code.into_inner(),
            product.into_inner(),
        )
        .await;
    match result {
        Ok(product) => HttpResponse::Ok().json(product),
        _ => HttpResponse::BadRequest().body("Product not found"),
    }
}

#[delete("/products/{product_code}")]
async fn delete(
    product_code: web::Path<i32>,
    context: web::Data<AppContext>,
    claims: JwtClaim,
) -> impl Responder {
    let result = context
        .product_repository
        .delete(claims.user_account_id, product_code.into_inner())
        .await;
    match result {
        Ok(rows) => {
            if rows > 0 {
                HttpResponse::Ok().body(format!("Successfully deleted {} record(s)", rows))
            } else {
                HttpResponse::BadRequest().body("Product not found")
            }
        }
        _ => HttpResponse::BadRequest().body("Product not found"),
    }
}

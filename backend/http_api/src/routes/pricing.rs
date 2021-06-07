use crate::{auth, AppContext};

use actix_web::{self, web, HttpResponse, Responder};
use pricing::ProductPriceSetRequest;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_current_price);
    cfg.service(set_price);
}

#[actix_web::get("/product_prices/{product_code}")]
async fn get_current_price(
    product_code: web::Path<i32>,
    context: web::Data<AppContext>,
    claims: auth::JwtClaim,
) -> impl Responder {
    let result = context
        .product_price_repository
        .get_current_price(claims.user_account_id, product_code.into_inner())
        .await;

    match result {
        Ok(product_price) => HttpResponse::Ok().json(product_price),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest()
                .body("Error trying to read all product prices from the database")
        }
    }
}

#[actix_web::post("/product_prices/{product_code}")]
async fn set_price(
    product_code: web::Path<i32>,
    context: web::Data<AppContext>,
    claims: auth::JwtClaim,
    request: web::Json<ProductPriceSetRequest>,
) -> impl Responder {
    let result = context
        .product_price_repository
        .set_price(
            claims.user_account_id,
            product_code.into_inner(),
            request.into_inner(),
        )
        .await;

    match result {
        Ok(product_price) => HttpResponse::Ok().json(product_price),
        Err(e) => {
            tracing::error!("{}", e);
            HttpResponse::BadRequest().body("ProductPrice not found")
        }
    }
}

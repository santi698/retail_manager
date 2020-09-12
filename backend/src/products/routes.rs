use crate::{
    products::{Product, ProductCreateRequest, ProductUpdateRequest},
    AppContext,
};

use actix_web::{delete, get, post, put, web, HttpResponse, Responder};
use actix_web::{Error, HttpRequest};
use futures::future::{ready, Ready};
use log::error;

impl Responder for Product {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        // create response and set content type
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

#[get("/products")]
async fn find_all(context: web::Data<AppContext>) -> impl Responder {
    let result = context.product_repository.find_all().await;
    match result {
        Ok(products) => HttpResponse::Ok().json(products),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("Error trying to read all products from database")
        }
    }
}

#[get("/products/{product_code}")]
async fn find(product_code: web::Path<i32>, context: web::Data<AppContext>) -> impl Responder {
    let result = context
        .product_repository
        .find_by_code(product_code.into_inner())
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
) -> impl Responder {
    let result = context
        .product_repository
        .create(product.into_inner())
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
) -> impl Responder {
    let result = context
        .product_repository
        .update(product_code.into_inner(), product.into_inner())
        .await;
    match result {
        Ok(product) => HttpResponse::Ok().json(product),
        _ => HttpResponse::BadRequest().body("Product not found"),
    }
}

#[delete("/products/{product_code}")]
async fn delete(product_code: web::Path<i32>, context: web::Data<AppContext>) -> impl Responder {
    let result = context
        .product_repository
        .delete(product_code.into_inner())
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

// function that will be called on new Application to configure routes for this module
pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find);
    cfg.service(create);
    cfg.service(update);
    cfg.service(delete);
}

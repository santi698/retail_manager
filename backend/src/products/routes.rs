use crate::products::{Product, ProductCreateRequest, ProductUpdateRequest};
use actix_web::{delete, get, post, put, web, HttpResponse, Responder};
use sqlx::PgPool;

#[get("/products")]
async fn find_all(db_pool: web::Data<PgPool>) -> impl Responder {
  let result = Product::find_all(db_pool.get_ref()).await;
  match result {
    Ok(products) => HttpResponse::Ok().json(products),
    _ => HttpResponse::BadRequest().body("Error trying to read all products from database"),
  }
}

#[get("/products/{product_code}")]
async fn find(product_code: web::Path<i32>, db_pool: web::Data<PgPool>) -> impl Responder {
  let result = Product::find_by_code(product_code.into_inner(), db_pool.get_ref()).await;
  match result {
    Ok(product) => HttpResponse::Ok().json(product),
    _ => HttpResponse::BadRequest().body("Product not found"),
  }
}

#[post("/products")]
async fn create(
  product: web::Json<ProductCreateRequest>,
  db_pool: web::Data<PgPool>,
) -> impl Responder {
  let result = Product::create(product.into_inner(), db_pool.get_ref()).await;
  match result {
    Ok(product) => HttpResponse::Ok().json(product),
    _ => {
      HttpResponse::BadRequest().body("Error trying to create new product {}")
    }
  }
}

#[put("/products/{product_code}")]
async fn update(
  product_code: web::Path<i32>,
  product: web::Json<ProductUpdateRequest>,
  db_pool: web::Data<PgPool>,
) -> impl Responder {
  let result = Product::update(
    product_code.into_inner(),
    product.into_inner(),
    db_pool.get_ref(),
  )
  .await;
  match result {
    Ok(product) => HttpResponse::Ok().json(product),
    _ => HttpResponse::BadRequest().body("Product not found"),
  }
}

#[delete("/products/{product_code}")]
async fn delete(product_code: web::Path<i32>, db_pool: web::Data<PgPool>) -> impl Responder {
  let result = Product::delete(product_code.into_inner(), db_pool.get_ref()).await;
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

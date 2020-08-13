use crate::client_orders::{ClientOrder, ClientOrderAddItemRequest, ClientOrderCreateRequest};
use actix_web::{get, post, web, HttpResponse, Responder};
use sqlx::PgPool;

#[get("/client_orders")]
async fn find_all(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = ClientOrder::find_all(&db_pool).await;

    match result {
        Ok(orders) => HttpResponse::Ok().json(orders),
        Err(_) => {
            HttpResponse::BadRequest().body("Error trying to read all orders from the database")
        }
    }
}

#[get("/client_orders/{order_id}")]
async fn find_by_id(order_id: web::Path<i32>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = ClientOrder::find_by_id(order_id.into_inner(), db_pool.get_ref()).await;

    match result {
        Ok(order) => HttpResponse::Ok().json(order),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("ClientOrder not found")
        }
    }
}

#[post("/client_orders")]
async fn create(
    request: web::Json<ClientOrderCreateRequest>,
    db_pool: web::Data<PgPool>,
) -> impl Responder {
    let result = ClientOrder::create(request.into_inner(), db_pool.get_ref()).await;

    match result {
        Ok(order) => HttpResponse::Ok().json(order),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("Error creating order")
        }
    }
}

#[post("/client_orders/{order_id}/items")]
async fn add_item(
    order_id: web::Path<i32>,
    request: web::Json<ClientOrderAddItemRequest>,
    db_pool: web::Data<PgPool>,
) -> impl Responder {
    let result = ClientOrder::add_item(
        order_id.into_inner(),
        request.into_inner(),
        db_pool.get_ref(),
    )
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().json({}),
        Err(e) => {
            error!("{}", e);
            HttpResponse::BadRequest().body("Error adding item to order")
        }
    }
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_all);
    cfg.service(find_by_id);
    cfg.service(create);
    cfg.service(add_item);
}

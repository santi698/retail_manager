use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{dev::Server, http, App, HttpServer};
use anyhow::Result;
use cities::{CityRepository, PostgresCityRepository};
use client_orders::{ClientOrderRepository, PostgresClientOrderRepository};
use clients::{ClientRepository, PostgresClientRepository};
use measurement_units::{MeasurementUnitRepository, PostgresMeasurementUnitRepository};
use products::{PostgresProductRepository, ProductRepository};
use sqlx::PgPool;

mod cities;
mod client_orders;
mod clients;
mod common;
mod measurement_units;
mod products;

struct AppContext {
    pub db_pool: PgPool,
    pub city_repository: Box<dyn CityRepository>,
    pub client_order_repository: Box<dyn ClientOrderRepository>,
    pub client_repository: Box<dyn ClientRepository>,
    pub measurement_unit_repository: Box<dyn MeasurementUnitRepository>,
    pub product_repository: Box<dyn ProductRepository>,
}

impl AppContext {
    pub fn new(db_pool: PgPool) -> Self {
        AppContext {
            city_repository: Box::new(PostgresCityRepository::new(db_pool.clone())),
            client_order_repository: Box::new(PostgresClientOrderRepository::new(db_pool.clone())),
            client_repository: Box::new(PostgresClientRepository::new(db_pool.clone())),
            product_repository: Box::new(PostgresProductRepository::new(db_pool.clone())),
            measurement_unit_repository: Box::new(PostgresMeasurementUnitRepository::new(
                db_pool.clone(),
            )),
            db_pool,
        }
    }
}

impl Clone for AppContext {
    fn clone(&self) -> Self {
        Self::new(self.db_pool.clone())
    }
}

pub fn run(host: String, port: String, db_pool: PgPool) -> Result<Server> {
    let server = HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::new()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .finish(),
            )
            .data(AppContext::new(db_pool.clone()))
            .configure(products::init)
            .configure(clients::init)
            .configure(client_orders::init)
            .configure(cities::init)
            .configure(measurement_units::init)
    })
    .bind(format!("{}:{}", host, port))?
    .run();

    Ok(server)
}

#[macro_use]
extern crate lazy_static;

#[macro_use]
extern crate async_trait;

use crate::customer_orders::PostgresCustomerOrderRepository;
use crate::customers::PostgresCustomerRepository;
use crate::pricing::PostgresProductPriceRepository;
use ::customer_orders::{CustomerOrderRepository, CustomerRepository};
use ::pricing::ProductPriceRepository;
use actix_cors::Cors;
use actix_identity::{CookieIdentityPolicy, IdentityService};
use actix_web::web::scope;
use actix_web::{dev::Server, http, App, HttpServer};
use chrono::Duration;
use cities::PostgresCityRepository;
use config::CONFIG;
use domain::{
    CityRepository, EmailAndPasswordIdentityRepository, MeasurementUnitRepository, UserRepository,
};
use identities::PostgresEmailAndPasswordIdentityRepository;
use inventory::ProductRepository;
use measurement_units::PostgresMeasurementUnitRepository;
use products::PostgresProductRepository;
use sqlx::PgPool;
use tracing_actix_web::TracingLogger;
use types::RepositoryError;
use users::PostgresUserRepository;

mod auth;
mod cities;
mod config;
mod customer_orders;
mod customers;
mod identities;
mod measurement_units;
mod pricing;
mod products;
pub mod telemetry;
mod types;
mod users;

struct AppContext {
    pub db_pool: PgPool,
    pub city_repository: Box<dyn CityRepository<Error = RepositoryError>>,
    pub customer_order_repository: Box<dyn CustomerOrderRepository<Error = RepositoryError>>,
    pub customer_repository: Box<dyn CustomerRepository<Error = RepositoryError>>,
    pub measurement_unit_repository: Box<dyn MeasurementUnitRepository<Error = RepositoryError>>,
    pub product_repository: Box<dyn ProductRepository<Error = RepositoryError>>,
    pub email_and_password_identity_repository:
        Box<dyn EmailAndPasswordIdentityRepository<Error = RepositoryError>>,
    pub user_repository: Box<dyn UserRepository<Error = RepositoryError>>,
    pub product_price_repository: Box<dyn ProductPriceRepository<Error = RepositoryError>>,
}

impl AppContext {
    pub fn new(db_pool: PgPool) -> Self {
        AppContext {
            city_repository: Box::new(PostgresCityRepository::new(db_pool.clone())),
            customer_order_repository: Box::new(PostgresCustomerOrderRepository::new(
                db_pool.clone(),
            )),
            customer_repository: Box::new(PostgresCustomerRepository::new(db_pool.clone())),
            product_price_repository: Box::new(PostgresProductPriceRepository::new(
                db_pool.clone(),
            )),
            product_repository: Box::new(PostgresProductRepository::new(db_pool.clone())),
            measurement_unit_repository: Box::new(PostgresMeasurementUnitRepository::new(
                db_pool.clone(),
            )),
            email_and_password_identity_repository: Box::new(
                PostgresEmailAndPasswordIdentityRepository::new(db_pool.clone()),
            ),
            user_repository: Box::new(PostgresUserRepository::new(db_pool.clone())),
            db_pool,
        }
    }
}

impl Clone for AppContext {
    fn clone(&self) -> Self {
        Self::new(self.db_pool.clone())
    }
}

pub async fn run() -> anyhow::Result<Server> {
    let db_pool = PgPool::connect(&CONFIG.database_url).await?;
    tracing::info!(
        "Server listening on {}:{}",
        CONFIG.http_host,
        CONFIG.http_port
    );
    let server = HttpServer::new(move || {
        App::new()
            .wrap(TracingLogger)
            .wrap(
                Cors::default()
                    .allowed_origin(&CONFIG.cors_allowed_origin)
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .supports_credentials(),
            )
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(&CONFIG.session_secret.clone().into_bytes())
                    .name(&CONFIG.session_name)
                    .secure(CONFIG.session_secure)
                    .path("/")
                    .max_age(Duration::hours(CONFIG.session_max_age_h).num_seconds()),
            ))
            .data(AppContext::new(db_pool.clone()))
            .service(scope("/auth").configure(auth::init))
            .service(
                scope("/api")
                    .wrap(auth::Auth)
                    .configure(products::init)
                    .configure(customers::init)
                    .configure(customer_orders::init)
                    .configure(pricing::init)
                    .configure(cities::init)
                    .configure(measurement_units::init),
            )
    })
    .bind(format!("{}:{}", CONFIG.http_host, CONFIG.http_port))?
    .run();

    Ok(server)
}

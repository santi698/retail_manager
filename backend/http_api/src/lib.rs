#[macro_use]
extern crate lazy_static;

use actix_cors::Cors;
use actix_identity::{CookieIdentityPolicy, IdentityService};
use actix_web::cookie;
use actix_web::web::scope;
use actix_web::{dev::Server, http, App, HttpServer};
use chrono::Duration;
use config::CONFIG;
use customer_orders::{
    CustomerOrderRepository, CustomerRepository, PostgresCustomerOrderRepository,
    PostgresCustomerRepository,
};
use domain::AccountSettingsRepository;
use domain::PostgresAccountSettingsRepository;
use domain::{
    CityRepository, EmailAndPasswordIdentityRepository, PostgresCityRepository,
    PostgresEmailAndPasswordIdentityRepository, PostgresUserRepository, RepositoryError,
    UserRepository,
};
use inventory::{
    InventoryLevelRepository, MeasurementUnitRepository, PostgresInventoryLevelRepository,
    PostgresMeasurementUnitRepository, PostgresProductRepository, ProductRepository,
};
use pricing::{PostgresProductPriceRepository, ProductPriceRepository};
use sqlx::PgPool;
use tracing_actix_web::TracingLogger;

mod auth;
mod config;
mod routes;
pub mod telemetry;
mod types;

struct AppContext {
    pub db_pool: Box<PgPool>,
    pub account_settings_repository: Box<dyn AccountSettingsRepository<Error = RepositoryError>>,
    pub city_repository: Box<dyn CityRepository<Error = RepositoryError>>,
    pub customer_order_repository: Box<dyn CustomerOrderRepository<Error = RepositoryError>>,
    pub customer_repository: Box<dyn CustomerRepository<Error = RepositoryError>>,
    pub inventory_level_repository: Box<dyn InventoryLevelRepository<Error = RepositoryError>>,
    pub measurement_unit_repository: Box<dyn MeasurementUnitRepository<Error = RepositoryError>>,
    pub product_repository: Box<dyn ProductRepository<Error = RepositoryError>>,
    pub email_and_password_identity_repository:
        Box<dyn EmailAndPasswordIdentityRepository<Error = RepositoryError>>,
    pub user_repository: Box<dyn UserRepository<Error = RepositoryError>>,
    pub product_price_repository: Box<dyn ProductPriceRepository<Error = RepositoryError>>,
}

impl AppContext {
    pub fn new(db_pool: &PgPool) -> Self {
        AppContext {
            db_pool: Box::new(db_pool.clone()),
            account_settings_repository: Box::new(PostgresAccountSettingsRepository::new(
                db_pool.clone(),
            )),
            city_repository: Box::new(PostgresCityRepository::new(db_pool.clone())),
            customer_order_repository: Box::new(PostgresCustomerOrderRepository::new(
                db_pool.clone(),
            )),
            customer_repository: Box::new(PostgresCustomerRepository::new(db_pool.clone())),
            inventory_level_repository: Box::new(PostgresInventoryLevelRepository::new(
                db_pool.clone(),
            )),
            measurement_unit_repository: Box::new(PostgresMeasurementUnitRepository::new(
                db_pool.clone(),
            )),
            product_repository: Box::new(PostgresProductRepository::new(db_pool.clone())),
            email_and_password_identity_repository: Box::new(
                PostgresEmailAndPasswordIdentityRepository::new(db_pool.clone()),
            ),
            user_repository: Box::new(PostgresUserRepository::new(db_pool.clone())),
            product_price_repository: Box::new(PostgresProductPriceRepository::new(
                db_pool.clone(),
            )),
        }
    }
}

impl Clone for AppContext {
    fn clone(&self) -> Self {
        Self::new(self.db_pool.as_ref())
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
                    .same_site(cookie::SameSite::Lax)
                    .path("/")
                    .max_age(Duration::hours(CONFIG.session_max_age_h).num_seconds()),
            ))
            .data(AppContext::new(&db_pool))
            .service(scope("/auth").configure(routes::auth))
            .service(
                scope("/api")
                    .wrap(auth::Auth)
                    .configure(routes::account_settings)
                    .configure(routes::products)
                    .configure(routes::customers)
                    .configure(routes::customer_orders)
                    .configure(routes::pricing)
                    .configure(routes::cities)
                    .configure(routes::measurement_units),
            )
    })
    .bind(format!("{}:{}", CONFIG.http_host, CONFIG.http_port))?
    .run();

    Ok(server)
}

#[macro_use]
extern crate log;

#[macro_use]
extern crate lazy_static;

#[macro_use]
extern crate async_trait;

use actix_cors::Cors;
use actix_identity::{CookieIdentityPolicy, IdentityService};
use actix_web::{dev::Server, http, App, HttpServer};
use actix_web::{middleware::Logger, web::scope};
use chrono::Duration;
use cities::{CityRepository, PostgresCityRepository};
use client_orders::{ClientOrderRepository, PostgresClientOrderRepository};
use clients::{ClientRepository, PostgresClientRepository};
use config::CONFIG;
use identities::{EmailAndPasswordIdentityRepository, PostgresEmailAndPasswordIdentityRepository};
use measurement_units::{MeasurementUnitRepository, PostgresMeasurementUnitRepository};
use products::{PostgresProductRepository, ProductRepository};
use sqlx::PgPool;
use users::{PostgresUserRepository, UserRepository};

mod auth;
mod cities;
mod client_orders;
mod clients;
mod config;
mod crypto;
mod identities;
mod measurement_units;
mod products;
mod types;
mod users;

struct AppContext {
    pub db_pool: PgPool,
    pub city_repository: Box<dyn CityRepository>,
    pub client_order_repository: Box<dyn ClientOrderRepository>,
    pub client_repository: Box<dyn ClientRepository>,
    pub measurement_unit_repository: Box<dyn MeasurementUnitRepository>,
    pub product_repository: Box<dyn ProductRepository>,
    pub email_and_password_identity_repository: Box<dyn EmailAndPasswordIdentityRepository>,
    pub user_repository: Box<dyn UserRepository>,
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
    let db_pool = PgPool::new(&CONFIG.database_url).await?;
    info!(
        "Server listening on {}:{}",
        CONFIG.http_host, CONFIG.http_port
    );
    let server = HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::new()
                    .allowed_origin(&CONFIG.cors_allowed_origin)
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .supports_credentials()
                    .finish(),
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
                    .configure(clients::init)
                    .configure(client_orders::init)
                    .configure(cities::init)
                    .configure(measurement_units::init),
            )
    })
    .bind(format!("{}:{}", CONFIG.http_host, CONFIG.http_port))?
    .run();

    Ok(server)
}

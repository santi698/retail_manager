extern crate pretty_env_logger;
#[macro_use]
extern crate log;

use actix_web::middleware::Logger;
use actix_web::{App, HttpServer};
use anyhow::Result;
use dotenv::dotenv;
use sqlx::postgres::PgPool;
use std::env;

mod products;
mod clients;
mod client_orders;

#[actix_rt::main]
async fn main() -> Result<()> {
    dotenv().ok();
    pretty_env_logger::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let db_pool = PgPool::new(&database_url).await?;

    let host = env::var("HOST").expect("HOST environment variable is missing");
    let port = env::var("PORT").expect("PORT environment variable is missing");

    info!("Server listening on {}:{}", host, port);

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .data(db_pool.clone())
            .configure(products::init)
            .configure(clients::init)
            .configure(client_orders::init)
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await?;

    Ok(())
}

extern crate pretty_env_logger;
#[macro_use]
extern crate log;

use retail_manager::run;

use anyhow::Result;
use dotenv::dotenv;
use sqlx::postgres::PgPool;
use std::env;

#[actix_rt::main]
async fn main() -> Result<()> {
    dotenv().ok();
    pretty_env_logger::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let db_pool = PgPool::new(&database_url).await?;

    let host = env::var("HOST").expect("HOST environment variable is missing");
    let port = env::var("PORT").expect("PORT environment variable is missing");

    info!("Server listening on {}:{}", host, port);

    run(host, port, db_pool)?.await?;

    Ok(())
}

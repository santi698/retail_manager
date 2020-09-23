extern crate pretty_env_logger;

use retail_manager::run;

use anyhow::Result;
use dotenv::dotenv;

#[actix_rt::main]
async fn main() -> Result<()> {
    dotenv().ok();
    pretty_env_logger::init();

    run().await?.await?;

    Ok(())
}

extern crate pretty_env_logger;

use dotenv::dotenv;

#[actix_rt::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();
    pretty_env_logger::init();

    retail_manager::run().await?.await?;

    Ok(())
}

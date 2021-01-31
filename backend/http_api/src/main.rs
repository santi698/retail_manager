use dotenv::dotenv;
use http_api::telemetry;
use tracing_bunyan_formatter::{BunyanFormattingLayer, JsonStorageLayer};
use tracing_subscriber::{layer::SubscriberExt, EnvFilter, Registry};

#[actix_web::main]
async fn main() -> anyhow::Result<()> {
    let (tracer, _uninstall) = opentelemetry_jaeger::new_pipeline()
        .from_env()
        .with_service_name("retail_manager")
        .install()?;
    let telemetry = tracing_opentelemetry::layer().with_tracer(tracer);
    let env_filter =
        EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info".to_string()));
    let formatting_layer = BunyanFormattingLayer::new("retail_manager".into(), std::io::stdout);
    let subscriber = Registry::default()
        .with(env_filter)
        .with(JsonStorageLayer)
        .with(formatting_layer)
        .with(telemetry);
    telemetry::init_subscriber(subscriber);
    dotenv().ok();

    http_api::run().await?.await?;

    Ok(())
}

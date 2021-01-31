//! Inject dotenv and env variables into the Config struct
//!
//! The envy crate injects environment variables into a struct.
//!
//! dotenv allows environment variables to be augmented/overwriten by a
//! .env file.
//!
//! This file throws the Config struct into a CONFIG lazy_static to avoid
//! multiple processing.

use dotenv::dotenv;
use serde::Deserialize;

#[derive(Clone, Deserialize, Debug)]
pub struct Config {
    pub database_url: String,
    pub http_host: String,
    pub http_port: String,
    pub session_secret: String,
    pub session_name: String,
    pub session_secure: bool,
    pub session_max_age_h: i64,
    pub jwt_key: String,
    pub jwt_expiration_h: i64,
    pub cors_allowed_origin: String,
    pub frontend_base_url: String,
}

// Throw the Config struct into a CONFIG lazy_static to avoid multiple processing
lazy_static! {
    pub static ref CONFIG: Config = get_config();
}

/// Use envy to inject dotenv and env vars into the Config struct
fn get_config() -> Config {
    dotenv().ok();

    match envy::from_env::<Config>() {
        Ok(config) => config,
        Err(error) => panic!("Configuration Error: {:#?}", error),
    }
}

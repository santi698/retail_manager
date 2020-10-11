use crate::config::CONFIG;
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JwtClaim {
    pub user_id: i32,
    pub identity_id: i32,
    exp: i64,
}

impl JwtClaim {
    pub fn new(user_id: i32, identity_id: i32) -> Self {
        Self {
            user_id,
            identity_id,
            exp: (Utc::now() + Duration::hours(CONFIG.jwt_expiration_h)).timestamp(),
        }
    }
}

pub fn create_jwt(claim: JwtClaim) -> anyhow::Result<String> {
    let encoding_key = EncodingKey::from_secret(&CONFIG.jwt_key.as_ref());
    Ok(encode(&Header::default(), &claim, &encoding_key)?)
}

pub fn decode_jwt(token: &str) -> anyhow::Result<JwtClaim> {
    let decoding_key = DecodingKey::from_secret(&CONFIG.jwt_key.as_ref());
    let claim =
        decode::<JwtClaim>(token, &decoding_key, &Validation::default()).map(|data| data.claims)?;
    Ok(claim)
}

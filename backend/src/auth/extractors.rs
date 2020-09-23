use std::fmt::Display;

use actix_identity::RequestIdentity;
use actix_web::{dev::Payload, FromRequest, HttpRequest, ResponseError};
use futures::future::{ready, Ready};

use super::{decode_jwt, JwtClaim};
#[derive(Clone, Debug)]
pub struct ExtractAuthenticationInfoError;

impl Display for ExtractAuthenticationInfoError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error extracting authentication info")
    }
}

impl ResponseError for ExtractAuthenticationInfoError {}

type Result<T> = std::result::Result<T, ExtractAuthenticationInfoError>;

fn jwt_claims_from_request(req: &HttpRequest) -> Result<JwtClaim> {
    let identity_cookie = RequestIdentity::get_identity(req);
    if let Some(token) = identity_cookie {
        return Ok(decode_jwt(&token).map_err(|_| ExtractAuthenticationInfoError {})?);
    }
    Err(ExtractAuthenticationInfoError {})
}

impl FromRequest for JwtClaim {
    type Error = ExtractAuthenticationInfoError;

    type Future = Ready<std::result::Result<Self, Self::Error>>;

    type Config = ();

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        ready(jwt_claims_from_request(req))
    }
}

use std::{fmt::Display, pin::Pin};

use actix_identity::RequestIdentity;
use actix_web::{dev::Payload, web::Data, FromRequest, HttpRequest, ResponseError};
use futures::{
    future::{ready, Ready},
    Future,
};

use crate::{users::User, AppContext};

use super::{decode_jwt, JwtClaim};
#[derive(Clone, Debug)]
pub struct ExtractAuthenticationInfoError;

impl Display for ExtractAuthenticationInfoError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error extracting authentication info")
    }
}

impl ResponseError for ExtractAuthenticationInfoError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        actix_web::http::StatusCode::UNAUTHORIZED
    }
}

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

impl FromRequest for User {
    type Error = ExtractAuthenticationInfoError;

    type Future = Pin<Box<dyn Future<Output = std::result::Result<Self, Self::Error>>>>;

    type Config = ();

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let claims = jwt_claims_from_request(req);
        let data = req
            .app_data::<Data<AppContext>>()
            .expect("App context expected to exist")
            .clone();
        Box::pin(async move {
            if let Ok(claims) = claims {
                if let Ok(user) = data.user_repository.find_by_id(claims.user_id).await {
                    return Ok(user);
                }
            }
            Err(Self::Error {})
        })
    }
}

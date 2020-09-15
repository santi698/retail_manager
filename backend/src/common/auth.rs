use std::fmt::Display;

use actix_web::{dev::Payload, http::HeaderValue, FromRequest, HttpRequest, ResponseError};
use futures::future::{ready, Ready};

type UserId = i32;

pub struct AuthenticationInfo {
    pub user_id: Option<UserId>,
}

#[derive(Clone, Debug)]
pub struct ExtractAuthenticationInfoError;

impl Display for ExtractAuthenticationInfoError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error extracting authentication info")
    }
}

impl ResponseError for ExtractAuthenticationInfoError {}

type Result<T> = std::result::Result<T, ExtractAuthenticationInfoError>;

fn user_from_authorization_header(header_value: &HeaderValue) -> Result<UserId> {
    let id = header_value
        .to_str()
        .map_err(|_| ExtractAuthenticationInfoError {})
        .and_then(|s| {
            s.parse::<i32>()
                .map_err(|_| ExtractAuthenticationInfoError {})
        })?;
    Ok(id)
}

fn authentication_info_from_request(req: &HttpRequest) -> Result<AuthenticationInfo> {
    let authentication = req.headers().get("authorization");
    match authentication {
        Some(header) => {
            let user_id = user_from_authorization_header(header)?;
            Ok(AuthenticationInfo {
                user_id: Some(user_id),
            })
        }
        None => Ok(AuthenticationInfo { user_id: None }),
    }
}

impl FromRequest for AuthenticationInfo {
    type Error = ExtractAuthenticationInfoError;

    type Future = Ready<std::result::Result<Self, Self::Error>>;

    type Config = ();

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        ready(authentication_info_from_request(req))
    }
}

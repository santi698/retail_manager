use actix_identity::Identity;
use actix_web::{
    dev::Body,
    get, post,
    web::{Data, Form, ServiceConfig},
    HttpResponse, Responder,
};
use serde::Deserialize;

use crate::AppContext;
use crate::CONFIG;

use super::{create_jwt, decode_jwt, JwtClaim};

pub fn init(cfg: &mut ServiceConfig) {
    cfg.service(login);
    cfg.service(me);
    cfg.service(logout);
}

#[derive(Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[post("/login")]
async fn login(
    request: Form<LoginRequest>,
    identity_cookie: Identity,
    context: Data<AppContext>,
) -> impl Responder {
    let find_identity_result = context
        .email_and_password_identity_repository
        .find_by_email(&request.email)
        .await;
    if let Ok(identity) = find_identity_result {
        if identity.verify(&request.password) {
            let user = context
                .user_repository
                .find_by_id(identity.user_id)
                .await
                .unwrap();
            match create_jwt(JwtClaim::new(user.id, user.account_id, identity.id)) {
                Ok(token) => {
                    identity_cookie.remember(token);
                    return HttpResponse::Found()
                        .set_header("Location", CONFIG.frontend_base_url.clone())
                        .finish();
                }
                Err(error) => {
                    tracing::error!("Unexpected error {}", error);
                    return HttpResponse::InternalServerError().finish();
                }
            }
        }
    }
    HttpResponse::Unauthorized().body("Incorrect email or password")
}

#[get("/me")]
async fn me(identity_cookie: Identity, context: Data<AppContext>) -> impl Responder {
    if let Some(token) = identity_cookie.identity() {
        if let Ok(claims) = decode_jwt(&token) {
            if let Ok(user) = context.user_repository.find_by_id(claims.user_id).await {
                return HttpResponse::Ok().json(user);
            }
        }
    }
    HttpResponse::Unauthorized().body("Invalid session")
}

#[get("/logout")]
async fn logout(identity_cookie: Identity) -> impl Responder {
    identity_cookie.forget();
    HttpResponse::Ok().body(Body::Empty)
}

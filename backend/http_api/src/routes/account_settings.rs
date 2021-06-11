use actix_web::{
    web::{Data, HttpResponse, Json, ServiceConfig},
    Responder,
};
use domain::AccountSettings;

use crate::{auth::JwtClaim, AppContext};

pub fn init(cfg: &mut ServiceConfig) {
    cfg.service(get);
    cfg.service(set);
}

#[actix_web::get("/account_settings")]
async fn get(context: Data<AppContext>, claims: JwtClaim) -> impl Responder {
    let settings = context
        .account_settings_repository
        .find_by_account_id(claims.user_account_id)
        .await;

    match settings {
        Ok(settings) => HttpResponse::Ok().json(settings),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[actix_web::put("/account_settings")]
async fn set(
    context: Data<AppContext>,
    claims: JwtClaim,
    new_settings: Json<AccountSettings>,
) -> impl Responder {
    let settings = context
        .account_settings_repository
        .set_by_account_id(claims.user_account_id, &new_settings)
        .await;

    match settings {
        Ok(settings) => HttpResponse::Ok().json(settings),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

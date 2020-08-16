use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{dev::Server, http, App, HttpServer};
use anyhow::Result;
use sqlx::PgPool;

mod client_orders;
mod clients;
mod products;

pub fn run(host: String, port: String, db_pool: PgPool) -> Result<Server> {
    let server = HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::new()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .finish(),
            )
            .data(db_pool.clone())
            .configure(products::init)
            .configure(clients::init)
            .configure(client_orders::init)
    })
    .bind(format!("{}:{}", host, port))?
    .run();

    Ok(server)
}

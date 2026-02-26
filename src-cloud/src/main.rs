mod database;
mod routes;
mod types;

use crate::database::redis::connect_redis;
use crate::types::route::RouteConfig;
use actix_web::{App, HttpServer, web};
use std::sync::Mutex;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let route_config = web::Data::new(RouteConfig {
        redis_client: Mutex::new(connect_redis()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(route_config.clone())
            .service(routes::get_data::route)
            .service(routes::post_data::route)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

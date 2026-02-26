use actix_web::dev::Payload;
use actix_web::{FromRequest, HttpRequest, Responder};
use redis::{Connection, RedisResult};
use std::sync::Mutex;

pub struct RouteConfig {
    pub redis_client: Mutex<Connection>,
}

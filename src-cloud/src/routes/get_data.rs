use actix_web::{Responder, post, web};

#[post("/")]

async fn route(name: web::Path<String>) -> impl Responder {
    "Hello World :D".to_string()
}

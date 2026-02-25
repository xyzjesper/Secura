use actix_web::dev::Response;
use actix_web::{CustomizeResponder, HttpRequest, HttpResponse, Responder, get, post, web};

#[post("/")]
async fn route() -> impl Responder {
    "Hello World :D".to_string()
}

use crate::types::route::RouteConfig;
use actix_web::cookie::time::macros::date;
use actix_web::{HttpRequest, HttpResponse, Responder, error, get, post, web};
use redis::TypedCommands;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CloudGETRequest {
    key: String,
}

#[derive(Serialize, Deserialize)]
pub struct CloudGETResponse {
    message: String,
    data: String,
    success: bool,
}

#[get("/")]
async fn route(
    data: web::Query<CloudGETRequest>,
    config: web::Data<RouteConfig>,
) -> impl Responder {
    let accounts = config.redis_client.lock().unwrap().get(data.key.clone());

    match accounts {
        Ok(exists) => {
            if (exists.is_none()) {
                return HttpResponse::Conflict().json(CloudGETResponse {
                    message: "No Accounts".to_string(),
                    data: String::new(),
                    success: false,
                });
            }

            HttpResponse::Ok().json(CloudGETResponse {
                message: "Export from the Cloud...".to_string(),
                data: exists.unwrap(),
                success: true,
            })
        }
        Err(_) => HttpResponse::Conflict().json(CloudGETResponse {
            message: "Error Accounts".to_string(),
            data: String::new(),
            success: false,
        }),
    }
}

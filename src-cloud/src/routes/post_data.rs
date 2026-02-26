use crate::types::route::RouteConfig;
use actix_web::cookie::time::macros::date;
use actix_web::{HttpResponse, Responder, post, web};
use redis::TypedCommands;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CloudPOSTRequest {
    key: String,
    accounts_base64: String,
}

#[derive(Serialize, Deserialize)]
pub struct CloudPOSTResponse {
    message: String,
    success: bool,
}

#[post("/")]
async fn route(
    data: web::Json<CloudPOSTRequest>,
    config: web::Data<RouteConfig>,
) -> impl Responder {
    let mut redis = config.redis_client.lock().unwrap();

    let is_set = redis.get(data.key.clone());

    match is_set {
        Ok(exists) => {
            if (!exists.is_none()) {
                return HttpResponse::Conflict().json(CloudPOSTResponse {
                    message: "Err".to_string(),
                    success: false,
                });
            }

            redis
                .set(data.key.clone(), data.accounts_base64.clone())
                .unwrap();

            HttpResponse::Ok().json(CloudPOSTResponse {
                message: "Uploaded to the Cloud...".to_string(),
                success: true,
            })
        }
        Err(_) => HttpResponse::Conflict().json(CloudPOSTResponse {
            message: "Err".to_string(),
            success: false,
        }),
    }
}

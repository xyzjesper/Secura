use crate::routes::get_data::CloudGETResponse;
use crate::types::route::RouteConfig;
use actix_web::cookie::time::macros::date;
use actix_web::{HttpResponse, Responder, post, web};
use redis::TypedCommands;
use serde::{Deserialize, Serialize};
use std::io::Bytes;

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

const MAX_SIZE: usize = 102400; // max payload size is 100KB

#[post("/")]
async fn route(payload: web::Payload, config: web::Data<RouteConfig>) -> impl Responder {
    let chunk = payload.to_bytes().await.unwrap();
    if (chunk.len() > MAX_SIZE) {
        return HttpResponse::Conflict().json(CloudPOSTResponse {
            message: "Payload is to large...".to_string(),
            success: false,
        });
    }
    let data = serde_json::from_slice::<CloudPOSTRequest>(&chunk).unwrap();

    let mut redis = config.redis_client.lock().unwrap();

    let is_set = redis.get(data.key.clone());

    match is_set {
        Ok(exists) => {
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

use redis::{Connection, TypedCommands};

pub fn connect_redis(REDIS_URI: String) -> Connection {
    redis::Client::open(REDIS_URI)
        .expect("Failed to connect to Redis")
        .get_connection()
        .unwrap()
}

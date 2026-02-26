use redis::{Connection, TypedCommands};

pub fn connect_redis() -> Connection {
    redis::Client::open("redis://:jesper@127.0.0.1:6379")
        .expect("Failed to connect to Redis")
        .get_connection()
        .unwrap()
}

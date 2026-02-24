use base64::{engine::general_purpose, Engine as _};
use serde::{Deserialize, Serialize};
use simple_crypt::{decrypt, encrypt};
use totp_rs::qrcodegen_image::image::EncodableLayout;

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginCallback {
    pub success: bool,
    pub message: String,
    pub code: String,
}

#[tauri::command]
pub fn encrypt_keys(password: String, key: String) -> String {
    let encrypted_data = encrypt(password.as_bytes(), key.as_bytes()).expect("Failed to encrypt");
    let encoded = general_purpose::STANDARD.encode(encrypted_data);
    encoded
}

#[tauri::command]
pub fn decrypt_keys(encrypted_data: &str, key: String) -> Result<String, bool> {
    let key_bytes = key.as_bytes();
    let decoded = general_purpose::STANDARD.decode(encrypted_data).unwrap();
    let decoded_vec = decoded.to_vec();
    let decoded_bytes = decoded_vec.as_bytes();

    let data = decrypt(decoded_bytes, key_bytes);

    match data {
        Ok(is_ok) => Ok(String::from_utf8(is_ok)
            .expect("Failed to convert string.")
            .to_string()),
        Err(_) => Err(true),
    }
}

#[tauri::command]
pub fn login(code: &str, secret_code: &str) -> Result<LoginCallback, LoginCallback> {
    let secret = decrypt_keys(&secret_code, code.to_string());
    match secret {
        Ok(s) => Ok(LoginCallback {
            success: true,
            message: "Logged in!".to_string(),
            code: s,
        }),
        Err(_) => Err(LoginCallback {
            success: false,
            message: format!("Failed to login!"),
            code: "Err".to_string(),
        }),
    }
}

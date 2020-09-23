use argon2::{hash_encoded, verify_encoded, Config};
use rand::Rng;
use std::iter;

pub fn hash(password: &str) -> String {
    let mut rng = rand::thread_rng();
    let config = Config::default();
    let salt: Vec<u8> = iter::repeat(())
        .map(|()| rng.gen::<u8>())
        .take(128)
        .collect();

    hash_encoded(&password.as_bytes(), &salt.as_slice(), &config).expect("Error hashing password")
}

pub fn compare(password: &str, password_hash: &str) -> bool {
    if let Ok(b) = verify_encoded(&password_hash, &password.as_bytes()) {
        return b;
    }
    false
}

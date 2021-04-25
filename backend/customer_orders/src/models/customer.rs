use async_trait::async_trait;
use domain::{Email, PhoneNumber};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerCreateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<Email>,
    pub phone_number: Option<PhoneNumber>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerUpdateRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<Email>,
    pub phone_number: Option<PhoneNumber>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct Customer {
    pub customer_id: i32,
    pub account_id: i32,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<Email>,
    pub phone_number: Option<PhoneNumber>,
    pub residence_city_id: i32,
    pub address: Option<String>,
}

#[async_trait]
pub trait CustomerRepository {
    type Error;

    async fn find_all(&self, account_id: i32) -> Result<Vec<Customer>, Self::Error>;
    async fn find_by_id(&self, account_id: i32, customer_id: i32) -> Result<Customer, Self::Error>;
    async fn create(
        &self,
        account_id: i32,
        request: CustomerCreateRequest,
    ) -> Result<Customer, Self::Error>;
    async fn update(
        &self,
        account_id: i32,
        customer_id: i32,
        request: CustomerUpdateRequest,
    ) -> Result<Customer, Self::Error>;
}

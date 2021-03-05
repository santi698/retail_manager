import { Customer } from "../domain/Customer";
import { RetailManagerApi } from "../common/services/RetailManagerApi";

export async function getCustomer(customer_id: number) {
  return RetailManagerApi.get<Customer>(`/api/customers/${customer_id}`);
}

export async function getCustomers() {
  return RetailManagerApi.get<Customer[]>(`/api/customers`);
}

export async function createCustomer(customer: Omit<Customer, "customer_id">) {
  return RetailManagerApi.post(`/api/customers`, customer);
}

export async function editCustomer(
  id: number,
  customer: Omit<Customer, "customer_id">
) {
  return RetailManagerApi.put(`/api/customers/${id}`, customer);
}

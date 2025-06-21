import type { Customer } from "@/components/customer-modal"
import { fetchWithAuth } from "../api";

export async function getCustomers() {
  return fetchWithAuth("/customers");
}

export async function getCustomer(id: number) {
  return fetchWithAuth(`/customers/${id}`);
}

export async function createCustomer(customerData: Omit<Customer, "id">) {
  return fetchWithAuth("/customers", {
    method: "POST",
    body: JSON.stringify(customerData),
  });
}

export async function updateCustomer(id: number, customerData: Partial<Customer>) {
  return fetchWithAuth(`/customers/${id}`, {
    method: "PUT", 
    body: JSON.stringify(customerData),
  });
}

export async function deleteCustomer(id: number) {
  return fetchWithAuth(`/customers/${id}`, {
    method: "DELETE",
  });
}
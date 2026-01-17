import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export async function createOrder(orderData, token) {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.orders.base}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error creating an order.");
  }

  return response.json();
}

export async function getOrderById(orderId) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.orders.byId(orderId)}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Order not found");
    }
    const error = await response.json();
    throw new Error(error.error || "Error fetching order");
  }

  return response.json();
}

export async function getUserOrders(firebaseUid) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.orders.byUser(firebaseUid)}`,
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch orders");
  }

  return response.json();
}

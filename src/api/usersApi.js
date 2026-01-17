import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users.me}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Error fetching user");
  }

  return response.json();
}

export async function createUser(userData, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users.base}`, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error creating user");
  }

  return response.json();
}

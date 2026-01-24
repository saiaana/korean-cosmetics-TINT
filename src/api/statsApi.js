import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export async function getPopularProducts(limit = 10, token) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.stats.popularProducts}?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch popular products");
  }

  return response.json();
}

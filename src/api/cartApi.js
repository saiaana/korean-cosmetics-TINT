import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export async function getCart(token) {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.cart.base}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch cart items");
  }

  return response.json();
}

export async function addToCart(token, productId, quantity, variantId = null) {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.cart.base}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity, variantId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add to cart");
  }

  return response.json();
}

export async function updateCartItem(
  token,
  productId,
  quantity,
  variantId = null
) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.cart.items(productId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity, variantId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update cart item");
  }

  return response.json();
}

export async function deleteCartItem(token, productId, variantId = null) {
  const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.cart.items(productId)}`);
  if (variantId) {
    url.searchParams.append("variantId", variantId);
  }

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete cart item");
  }

  return response.json();
}

export async function clearCart(token) {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.cart.base}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to clear cart");
  }

  return response.json();
}

export async function mergeGuestCart(token, items) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.cart.merge}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(items),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to merge guest cart");
    }
    return response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error merging guest cart:", error);
    }
    throw new Error("Failed to merge guest cart");
  }
}

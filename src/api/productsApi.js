import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export async function getAllProducts() {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.products.all}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch products");
  }
  return response.json();
}

export async function getAllBrands() {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.brands}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch brands");
  }

  return response.json();
}

export async function getCategories() {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.categoriesList}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch categories");
  }

  return response.json();
}

export async function getCategoriesList() {
  return getCategories();
}

export async function getNewProducts(page = 1, limit = 12) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.new}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch new products");
  }

  return response.json();
}

export async function getOnSaleProducts(page = 1, limit = 12) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.onSale}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch on sale products");
  }

  return response.json();
}

export async function getBestsellerProducts(page = 1, limit = 12) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.bestsellers}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch bestseller products");
  }

  return response.json();
}

export async function getProductsByCategory(category, page = 1, limit = 12) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.categories(category)}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch products by category");
  }

  return response.json();
}

export async function getProductsByBrand(brand, page = 1, limit = 12) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.brand(brand)}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch products by brand");
  }

  return response.json();
}

export async function getProductBySlug(slug) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.slug(slug)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch product");
  }

  return response.json();
}

export async function getSimilarProducts({ category, brand, excludeId }) {
  const params = new URLSearchParams({
    category: category || "",
    brand: brand || "",
    excludeId: excludeId ? excludeId.toString() : "",
  });

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.similar}?${params}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch similar products");
  }

  return response.json();
}

export async function searchProducts(searchQuery, signal = null) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.search}?search=${encodeURIComponent(searchQuery)}`,
    { signal }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to search products");
  }

  return response.json();
}

export async function getProductVariants(productId) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.variants(productId)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch product variants");
  }

  return response.json();
}

export async function getAllAdminProducts(token) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.adminAll}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch admin products");
  }

  return response.json();
}

export async function getAdminProductById(productId, token) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.adminById(productId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch product");
  }

  return response.json();
}

export async function updateProductActiveStatus(productId, isActive, token) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.updateActive(productId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: isActive }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update product status");
  }

  return response.json();
}

export async function updateProduct(productId, productData, token) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.update(productId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update product");
  }

  return response.json();
}

export async function createProduct(productData, token) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.base}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create product");
  }

  return response.json();
}

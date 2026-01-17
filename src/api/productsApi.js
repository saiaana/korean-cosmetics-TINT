import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import { getProductSlug } from "../utils/products/getProductSlug";

export async function getAllBrands() {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.brands}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch brands");
  }
  return response.json();
}

export async function getProductsByCategory(category, page, limit) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.categories(category)}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch products by category");
  }
  return response.json();
}

async function fetchPaginatedProducts(url, page, limit, errorMessage) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const queryString = params.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || errorMessage);
  }

  return response.json();
}

export async function getProductsByBrand(brand, page, limit) {
  return fetchPaginatedProducts(
    `${API_BASE_URL}${API_ENDPOINTS.products.brand(brand)}`,
    page,
    limit,
    "Failed to fetch products by brand",
  );
}

export async function getNewProducts(page, limit) {
  return fetchPaginatedProducts(
    `${API_BASE_URL}${API_ENDPOINTS.products.new}`,
    page,
    limit,
    "Failed to fetch new products",
  );
}

export async function getOnSaleProducts(page, limit) {
  return fetchPaginatedProducts(
    `${API_BASE_URL}${API_ENDPOINTS.products.onSale}`,
    page,
    limit,
    "Failed to fetch on sale products",
  );
}

export async function getBestsellerProducts(page, limit) {
  return fetchPaginatedProducts(
    `${API_BASE_URL}${API_ENDPOINTS.products.bestsellers}`,
    page,
    limit,
    "Failed to fetch bestseller products",
  );
}

export async function getSimilarProducts({
  category,
  brand,
  excludeId,
  limit = 10,
}) {
  const params = new URLSearchParams();
  if (category) {
    params.append("category", category);
  }
  if (brand) {
    params.append("brand", brand);
  }
  if (excludeId) {
    params.append("excludeId", excludeId);
  }
  if (limit) {
    params.append("limit", limit);
  }
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.similar}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch similar products");
  }
  return response.json();
}

export async function getProductBySlug(slug) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.slug(slug)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch product by slug");
  }
  return response.json();
}

export async function searchProducts(query, signal = null) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.search}?search=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to search products");
  }

  const data = await response.json();

  return data.map((item) => ({
    ...item,
    slug: getProductSlug(item.id, item.title),
  }));
}

export async function getProductVariants(productId) {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.variants(productId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch product variants");
  }
  return response.json();
}

export async function getCategories() {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.products.categoriesList}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch categories");
  }
  return response.json();
}

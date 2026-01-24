export const getCurrentHostname = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "localhost";
};

export const getCurrentProtocol = () => {
  if (typeof window !== "undefined") {
    return window.location.protocol;
  }
  return "http:";
};

export const isLocalhost = (hostname) => {
  return hostname === "localhost" || hostname === "127.0.0.1";
};

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
};

// const getApiBaseUrl = () => {
//   if (import.meta.env.VITE_API_BASE_URL) {
//     return import.meta.env.VITE_API_BASE_URL;
//   }

//   const hostname = getCurrentHostname();

//   if (isLocalhost(hostname)) {
//     return "http://localhost:4000";
//   }

//   const apiUrl = `http://${hostname}:4000`;

//   return apiUrl;
// };

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  orders: {
    base: "/api/orders",
    all: "/api/orders/all",
    byId: (id) => `/api/orders/${id}`,
    byUser: (firebaseUid) => `/api/orders/user/${firebaseUid}`,
    updateStatus: (orderId) => `/api/orders/${orderId}/status`,
  },
  users: {
    base: "/api/users",
    me: "/api/users/me",
  },
  products: {
    base: "/api/products",
    all: "/api/products/all",
    search: "/api/products/search",
    brands: "/api/products/brands",
    brand: (brand) => `/api/products/brands/${brand}`,
    categories: (category) => `/api/products/categories/${category}`,
    new: "/api/products/new",
    onSale: "/api/products/on-sale",
    bestsellers: "/api/products/bestsellers",
    similar: "/api/products/similar",
    slug: (slug) => `/api/products/slug/${slug}`,
    categoriesList: "/api/products/categoriesList",
    variants: (productId) => `/api/products/${productId}/variants`,
    adminAll: "/api/products/admin/all",
    adminById: (productId) => `/api/products/admin/${productId}`,
    updateActive: (productId) => `/api/products/${productId}/active`,
    update: (productId) => `/api/products/${productId}`,
  },
  cart: {
    base: "/api/cart",
    items: (productId) => `/api/cart/${productId}`,
    merge: "/api/cart/merge",
  },
  stats: {
    base: "/api/stats",
    popularProducts: "/api/stats/popular-products",
  },
};

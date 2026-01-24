const ROUTES = {
  home: "/",
  search: "/search",
  account: "/account",
  cart: "/cart",
  brands: "/brands",
  newIn: "/new-in",
  promotions: "/promotions",
  bestsellers: "/bestsellers",
  blog: "/blog",
  categories: "/categories",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
  createOrder: "/order/new",

  category: (slug) => `/categories/${slug}`,
  product: (slug) => `/product/${slug}`,
  blogPost: (slug) => `/blog/${slug}`,
  orderConfirmation: (orderId) => `/order/confirmation/${orderId}`,
  order: (orderId) => `/order/${orderId}`,
  orderItems: (orderId) => `/order/items/${orderId}`,
  brand: (slug) => `/brands/${slug}`,
  admin: "/admin",
};

export default ROUTES;

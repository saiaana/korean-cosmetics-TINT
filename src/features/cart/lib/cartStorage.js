const CART_STORAGE_KEY = "cart";

export const getCartFromStorage = () => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const setCartToStorage = (cart) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const removeCartFromStorage = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

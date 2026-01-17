export function getCartItemKey(productId, variantId) {
  if (variantId !== null && variantId !== undefined) {
    return `${productId}-${variantId}`;
  }
  return String(productId);
}

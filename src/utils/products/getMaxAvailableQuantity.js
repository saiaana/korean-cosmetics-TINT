export function getMaxAvailableQuantity({
  variantId,
  variantStock,
  productStock,
}) {
  if (variantId) {
    if (variantStock === null || variantStock === undefined) {
      return 0;
    }
    const stockValue = Number(variantStock);
    return isNaN(stockValue) ? 0 : Math.max(0, stockValue);
  }

  if (productStock === null || productStock === undefined) {
    return 0;
  }
  const stockValue = Number(productStock);
  return isNaN(stockValue) ? 0 : Math.max(0, stockValue);
}

export function exceededMaxAvailableQuantity({
  variantId,
  variantStock,
  productStock,
  quantity,
}) {
  const maxQuantity = getMaxAvailableQuantity({
    variantId,
    variantStock,
    productStock,
  });
  if (maxQuantity <= 0) return false;
  return quantity >= maxQuantity;
}

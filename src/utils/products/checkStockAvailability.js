export function checkStockAvailability({
  variantId,
  variantStock,
  productStock,
}) {
  if (variantId) {
    if (variantStock === null || variantStock === undefined) {
      return false;
    }
    const stockValue = Number(variantStock);

    if (isNaN(stockValue)) {
      return false;
    }
    return stockValue <= 0;
  }

  if (productStock === null || productStock === undefined) {
    return false;
  }

  const stockValue = Number(productStock);

  if (isNaN(stockValue)) {
    return false;
  }

  return stockValue <= 0;
}

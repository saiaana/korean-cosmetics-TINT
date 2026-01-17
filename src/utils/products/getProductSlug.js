export function getProductSlug(productId, productTitle) {
  if (!productTitle) {
    return String(productId);
  }

  const normalizedTitle = productTitle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  return `${productId}-${encodeURIComponent(normalizedTitle)}`;
}

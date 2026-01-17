import { getFinalPrice } from "../helpers";

export function normalizeProduct(product) {
  if (!product || typeof product !== "object") {
    return product;
  }

  const finalPrice = Number(
    getFinalPrice(product.price, product.discount_percent, product.on_sale),
  );

  return {
    ...product,
    finalPrice,
  };
}

export function normalizeProducts(products) {
  if (!Array.isArray(products)) {
    return products;
  }
  return products.map(normalizeProduct);
}

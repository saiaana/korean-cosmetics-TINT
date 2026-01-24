import { normalizeProduct } from "../products/normalizeProduct";

export function normalizeCartItem(item) {
  const normalizedProduct = normalizeProduct(item);
  const productHasVariants = item.variant_id && item.variant_title;

  if (productHasVariants) {
    const variantPrice = item.variant_price ?? normalizedProduct.price;
    const variantImages = item.variant_images || normalizedProduct.images || [];
    const variantStock =
      item.variant_stock !== null && item.variant_stock !== undefined
        ? Number(item.variant_stock)
        : item.variant_stock;

    return {
      ...normalizedProduct,
      title: `${normalizedProduct.title} - ${item.variant_title}`,
      baseTitle: normalizedProduct.title,
      price: variantPrice,
      finalPrice: variantPrice,
      images: variantImages,
      variant_stock: variantStock,
      product_id: item.product_id,
      variant_id: item.variant_id,
      variant_title: item.variant_title,
      quantity: Number(item.quantity) || 1,
      product_is_active: item.product_is_active,
      variant_is_active: item.variant_is_active,
    };
  }

  return {
    ...normalizedProduct,
    product_id: item.product_id,
    variant_id: item.variant_id !== undefined ? item.variant_id : null,
    quantity: Number(item.quantity) || 1,
    product_is_active: item.product_is_active,
    variant_is_active: item.variant_is_active,
  };
}

export function resolveActiveProductItem({
  product,
  selectedVariant,
  hasVariants,
}) {
  if (!product) return null;

  if (hasVariants && selectedVariant) {
    return {
      productId: Number(product.id),
      variantId: Number(selectedVariant.id),
      stock: selectedVariant.variant_stock,
      price: selectedVariant.variant_price ?? product.price,
      title: `${product.title} - ${selectedVariant.variant_title}`,
      images: selectedVariant.images || product.images,
    };
  }

  return {
    productId: Number(product.id),
    variantId: null,
    stock: product.stock,
    price: product.price,
    title: product.title,
    images: product.images,
  };
}

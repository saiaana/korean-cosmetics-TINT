import { getMaxAvailableQuantity } from "../../../utils/products/getMaxAvailableQuantity";

export default function ProductStockStatusNotice({
  hasVariants,
  selectedVariant,
  productStock,
  isOutOfStock,
  stockStatus,
  existingCartQuantity,
}) {
  if (hasVariants && !selectedVariant) {
    return (
      <p className="text-sm text-amber-600">
        Please select a variant before adding to cart
      </p>
    );
  }

  if (isOutOfStock) {
    return (
      <p className="text-sm text-amber-600">This product is out of stock</p>
    );
  }

  const maxQuantity = getMaxAvailableQuantity({
    variantId: selectedVariant?.id || null,
    variantStock: selectedVariant?.variant_stock || null,
    productStock: productStock || null,
  });

  const availableStock = Math.max(0, maxQuantity - existingCartQuantity);

  if (availableStock <= 0) {
    return (
      <p className="text-sm text-amber-600">
        Maximum available quantity reached
      </p>
    );
  }

  if (stockStatus === "Low Stock" || availableStock <= 5) {
    return (
      <p className="text-sm text-amber-600">
        Only {availableStock} left in stock
      </p>
    );
  }

  return null;
}

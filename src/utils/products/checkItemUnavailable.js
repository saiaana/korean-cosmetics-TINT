import { checkStockAvailability } from "./checkStockAvailability";

export function checkItemUnavailable(item) {
  const isInactive = item.variant_id
    ? item.variant_is_active === false
    : item.product_is_active === false;

  const isOutOfStock = checkStockAvailability({
    variantId: item.variant_id,
    variantStock: item.variant_stock,
    productStock: item.stock,
  });

  return isInactive || isOutOfStock;
}

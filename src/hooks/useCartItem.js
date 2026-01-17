import { getMainImageUrl } from "../utils/helpers";
import { getProductSlug } from "../utils/products/getProductSlug";
import { checkStockAvailability } from "../utils/products/checkStockAvailability";
import { useMemo } from "react";
import { exceededMaxAvailableQuantity } from "../utils/products/getMaxAvailableQuantity";

export default function useCartItem({ item }) {
  const mainImage = getMainImageUrl(item.images);

  const productSlug = useMemo(
    () => getProductSlug(item.product_id, item.title || item.name),
    [item.product_id, item.title, item.name],
  );

  const productTotal = (finalPrice, quantity) => {
    const price = finalPrice || 0;
    return (Number(price) * Number(quantity)).toFixed(2);
  };

  const originalPrice = item.price.toFixed(2);
  const salePrice = item.finalPrice.toFixed(2);
  const isOnSale = item.on_sale && salePrice < originalPrice;
  const displayTitle = item.title || item.name || `Product #${item.product_id}`;
  const displayTotal = productTotal(salePrice || originalPrice, item.quantity);

  const isExceededMaxAvailableQuantity = useMemo(() => {
    return exceededMaxAvailableQuantity({
      variantId: item.variant_id,
      variantStock: item.variant_stock,
      productStock: item.stock,
      quantity: item.quantity,
    });
  }, [item.variant_id, item.variant_stock, item.stock, item.quantity]);

  const isOutOfStock = useMemo(() => {
    return checkStockAvailability({
      variantId: item.variant_id,
      variantStock: item.variant_stock,
      productStock: item.stock,
    });
  }, [item.variant_id, item.variant_stock, item.stock]);

  return {
    mainImage,
    productSlug,
    isOnSale,
    salePrice,
    originalPrice,
    displayTitle,
    displayTotal,
    isOutOfStock,
    exceededMaxAvailableQuantity: isExceededMaxAvailableQuantity,
  };
}

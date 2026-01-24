import { getMaxAvailableQuantity } from "../../../utils/products/getMaxAvailableQuantity";

export function addGuestItem(items, payload) {
  const { productId, variantId, quantity, productData } = payload;

  const idx = items.findIndex(
    (item) =>
      Number(item.product_id) === Number(productId) &&
      (variantId == null
        ? item.variant_id == null
        : Number(item.variant_id) === Number(variantId))
  );

  if (idx !== -1) {
    const item = items[idx];
    const maxQuantity = getMaxAvailableQuantity({
      variantId: item.variant_id,
      variantStock: item.variant_stock,
      productStock: item.stock,
    });

    if (maxQuantity <= 0) return items;

    const nextQuantity = Math.min(item.quantity + quantity, maxQuantity);

    return items.map((it, i) =>
      i === idx ? { ...it, quantity: nextQuantity } : it
    );
  }

  return [
    ...items,
    {
      product_id: productId,
      variant_id: variantId ?? null,
      quantity,
      ...(productData ?? {}),
    },
  ];
}

export function updateGuestItem(items, payload) {
  const { productId, variantId, quantity } = payload;

  return items.map((item) =>
    Number(item.product_id) === Number(productId) &&
    (variantId == null
      ? item.variant_id == null
      : Number(item.variant_id) === Number(variantId))
      ? { ...item, quantity }
      : item
  );
}

export function deleteGuestItem(items, payload) {
  const { productId, variantId } = payload;

  return items.filter(
    (item) =>
      !(
        Number(item.product_id) === Number(productId) &&
        (variantId == null
          ? item.variant_id == null
          : Number(item.variant_id) === Number(variantId))
      )
  );
}

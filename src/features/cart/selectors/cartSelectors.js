import { createSelector } from "@reduxjs/toolkit";
import { getCartItemKey } from "../../../utils/cart/getCartItemKey";
import { checkStockAvailability } from "../../../utils/products/checkStockAvailability";

export const selectCartItems = (state) => state.cart.items;
export const selectSelectedMap = (state) => state.cart.selected;

export const selectSelectedItems = createSelector(
  [selectCartItems, selectSelectedMap],
  (items, selected) =>
    items.filter((item) => {
      const itemKey = getCartItemKey(item.product_id, item.variant_id);
      return selected[itemKey];
    }),
);
export const selectIsAllSelected = createSelector(
  [selectCartItems, selectSelectedMap],
  (items, selected) => {
    const availableItems = items.filter((item) => {
      return !checkStockAvailability({
        variantId: item.variant_id,
        variantStock: item.variant_stock,
        productStock: item.stock,
      });
    });

    if (availableItems.length === 0) return false;

    return availableItems.every((item) => {
      const itemKey = getCartItemKey(item.product_id, item.variant_id);
      return selected[itemKey];
    });
  },
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => {
    const finalPrice = item.finalPrice ?? Number(item.price);
    return total + finalPrice * item.quantity;
  }, 0),
);

export const selectSelectedItemsTotal = createSelector(
  [selectSelectedItems],
  (selectedItems) =>
    selectedItems.reduce((total, item) => {
      const finalPrice = item.finalPrice ?? Number(item.price);
      return total + finalPrice * item.quantity;
    }, 0),
);

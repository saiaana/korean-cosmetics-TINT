import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAllSelected } from "../features/cart/selectors/cartSelectors";
import { toggleSelected } from "../store/slices/cartSlice";
import { unselectAll } from "../store/slices/cartSlice";
import { selectAll } from "../store/slices/cartSlice";
import { updateCartItem } from "../store/slices/cartSlice";
import { clearCartItems } from "../store/slices/cartSlice";
import { deleteCartItem } from "../store/slices/cartSlice";

import { getMaxAvailableQuantity } from "../utils/products/getMaxAvailableQuantity";
import { getCartItemKey } from "../utils/cart/getCartItemKey";

export function useCartPage() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.items);
  const selected = useSelector((state) => state.cart.selected);
  const isAllSelected = useSelector(selectIsAllSelected);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [clearCartConfirmation, setClearCartConfirmation] = useState(false);

  const handleSelectAll = useCallback(() => {
    isAllSelected ? dispatch(unselectAll()) : dispatch(selectAll());
  }, [dispatch, isAllSelected]);

  const handleSelectOne = useCallback(
    (productId) => {
      dispatch(toggleSelected(productId));
    },
    [dispatch]
  );

  const handleIncrease = useCallback(
    (productId, quantity, variantId = null) => {
      const cartItem = cart.find(
        (item) =>
          Number(item.product_id) === Number(productId) &&
          (variantId
            ? Number(item.variant_id) === Number(variantId)
            : item.variant_id === null)
      );

      if (!cartItem) return;

      const maxQuantity = getMaxAvailableQuantity({
        variantId: cartItem.variant_id,
        variantStock: cartItem.variant_stock,
        productStock: cartItem.stock,
      });

      if (quantity >= maxQuantity) {
        return;
      }

      dispatch(
        updateCartItem({
          productId,
          variantId,
          quantity: quantity + 1,
        })
      );
    },
    [dispatch, cart]
  );

  const handleDecrease = useCallback(
    (productId, quantity, variantId = null) => {
      const currentQuantity = Number(quantity);
      if (currentQuantity <= 1) {
        setPendingDeleteId({ productId, variantId });
        return;
      } else {
        dispatch(
          updateCartItem({
            productId,
            variantId,
            quantity: quantity - 1,
          })
        );
      }
    },
    [dispatch]
  );

  const confirmDelete = useCallback(() => {
    if (!pendingDeleteId) return;

    dispatch(deleteCartItem(pendingDeleteId));
    setPendingDeleteId(null);
  }, [dispatch, pendingDeleteId]);

  const cancelDelete = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

  const handleDelete = useCallback((productId, variantId = null) => {
    setPendingDeleteId({ productId, variantId });
  }, []);

  const confirmClearCart = useCallback(() => {
    dispatch(clearCartItems());
    setClearCartConfirmation(false);
  }, [dispatch]);

  const cancelClearCart = useCallback(() => {
    setClearCartConfirmation(false);
  }, []);

  const totalPrice = useMemo(
    () =>
      cart.reduce((total, { product_id, variant_id, finalPrice, quantity }) => {
        const itemKey = getCartItemKey(product_id, variant_id);
        if (selected[itemKey]) {
          return total + finalPrice * quantity;
        }

        return total;
      }, 0),
    [cart, selected]
  );

  return {
    cart,
    selected,
    isAllSelected,
    totalPrice,
    handleSelectAll,
    handleSelectOne,
    handleIncrease,
    handleDelete,
    handleDecrease,
    confirmDelete,
    cancelDelete,
    pendingDeleteId,
    clearCartConfirmation,
    confirmClearCart,
    cancelClearCart,
    setClearCartConfirmation,
  };
}

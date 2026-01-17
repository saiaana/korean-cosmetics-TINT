import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { getMaxAvailableQuantity } from "../utils/products/getMaxAvailableQuantity";

export function useProductCart(activeItem) {
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart.items);
  const cartSource = useSelector((s) => s.cart.source);

  const existsInCart = useMemo(() => {
    if (!activeItem) return null;

    return (
      cart.find((item) => {
        const itemProductId = Number(item.product_id);
        const itemVariantId =
          item.variant_id !== null && item.variant_id !== undefined
            ? Number(item.variant_id)
            : null;

        return (
          itemProductId === activeItem.productId &&
          itemVariantId === activeItem.variantId
        );
      }) || null
    );
  }, [cart, activeItem]);

  const existingQuantity = existsInCart?.quantity ?? 0;

  const add = () => {
    if (!activeItem) return;

    const max = getMaxAvailableQuantity({
      variantId: activeItem.variantId,
      variantStock: activeItem.variantId ? activeItem.stock : null,
      productStock: activeItem.variantId ? null : activeItem.stock,
    });
    if (max <= 0) return;
    if (existingQuantity >= max) return;

    dispatch(
      addToCart({
        productId: activeItem.productId,
        variantId: activeItem.variantId,
        quantity: 1,
        ...(cartSource === "guest" && {
          productData: {
            title: activeItem.title,
            price: activeItem.price,
            finalPrice: activeItem.price,
            images: activeItem.images,
            stock: activeItem.variantId ? null : activeItem.stock,
            variant_stock: activeItem.variantId ? activeItem.stock : null,
          },
        }),
      }),
    );
  };

  return {
    existsInCart,
    existingQuantity,
    addToCart: add,
  };
}

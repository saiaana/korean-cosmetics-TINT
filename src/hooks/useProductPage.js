import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductBySlug } from "../store/slices/productsSlice";
import {
  selectCurrentProduct,
  selectCurrentProductStatus,
} from "../store/slices/productsSlice";
import { resolveActiveProductItem } from "../features/products/resolveActiveProductItem";
import { useProductVariants } from "./useProductVariants";
import { useProductStock } from "./useProductStock";
import { useProductCart } from "./useProductCart";
import { getImageUrl } from "../utils/helpers";
import { exceededMaxAvailableQuantity } from "../utils/products/getMaxAvailableQuantity";

export default function useProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const product = useSelector(selectCurrentProduct);
  const productStatus = useSelector(selectCurrentProductStatus);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
  }, [slug, dispatch]);

  const {
    variants,
    hasVariants,
    variantsStatus,
    selectedVariant,
    selectVariant,
  } = useProductVariants(product?.id);

  const activeItem = useMemo(
    () =>
      resolveActiveProductItem({
        product,
        selectedVariant,
        hasVariants,
      }),
    [product, selectedVariant, hasVariants]
  );

  const stock = useProductStock(activeItem);
  const isOutOfStock = stock.isOutOfStock;
  const stockStatus = stock.status;

  const cart = useProductCart(activeItem);

  const isExceededMaxAvailableQuantity = useMemo(() => {
    if (!activeItem) return false;
    return exceededMaxAvailableQuantity({
      variantId: activeItem.variantId,
      variantStock: activeItem.variantId ? activeItem.stock : null,
      productStock: activeItem.variantId ? null : activeItem.stock,
      quantity: cart.existingQuantity,
    });
  }, [activeItem, cart.existingQuantity]);

  const images = product?.images
    ? product.images.map((img) => getImageUrl(img.url))
    : [];

  return {
    slug,
    product,
    productStatus,

    variants,
    variantsStatus,
    hasVariants,
    selectedVariant,

    stock,
    stockStatus,
    isOutOfStock,
    cart,

    exceededMaxAvailableQuantity: isExceededMaxAvailableQuantity,

    images,
    handleVariantSelect: selectVariant,
  };
}

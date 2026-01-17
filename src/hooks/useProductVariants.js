import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductVariants,
  clearVariants,
  setSelectedVariant,
} from "../store/slices/variantsSlice";
import { useSearchParams } from "react-router-dom";

export function useProductVariants(productId) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialLoadFromUrl = useRef(false);

  const variants = useSelector((s) => s.variants.variants);
  const variantsStatus = useSelector((s) => s.variants.variantsStatus);
  const selectedVariant = useSelector((s) => s.variants.selectedVariant);

  const hasVariants = variants?.length > 0;

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductVariants(productId));
      isInitialLoadFromUrl.current = false;
    } else {
      dispatch(clearVariants());
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (!hasVariants || variantsStatus !== "succeeded") return;

    const idFromUrl = searchParams.get("variantId");

    if (idFromUrl) {
      const variant = variants.find((v) => Number(v.id) === Number(idFromUrl));
      if (
        variant &&
        (!selectedVariant || Number(selectedVariant.id) !== Number(idFromUrl))
      ) {
        dispatch(setSelectedVariant(variant));
        isInitialLoadFromUrl.current = true;
      }
    }
  }, [
    hasVariants,
    variantsStatus,
    variants,
    searchParams,
    selectedVariant,
    dispatch,
  ]);

  const selectVariant = (variant) => {
    dispatch(setSelectedVariant(variant));

    if (variant) {
      setSearchParams({ variantId: variant.id });
      isInitialLoadFromUrl.current = false;
    } else {
      setSearchParams({});
    }
  };

  return {
    variants,
    hasVariants,
    variantsStatus,
    selectedVariant,
    selectVariant,
  };
}

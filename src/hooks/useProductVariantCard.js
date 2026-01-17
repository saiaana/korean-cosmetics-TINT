import { useMemo } from "react";
import { getImageUrl } from "../utils/helpers";

export default function useProductVariantCard(variant, productPrice) {
  const variantImages = useMemo(() => {
    if (!variant?.images || variant.images.length === 0) return [];

    return [...variant.images]
      .sort((a, b) => {
        if (a.is_main) return -1;
        if (b.is_main) return 1;
        return (a.position || 0) - (b.position || 0);
      })
      .map((img) => getImageUrl(img.url));
  }, [variant?.images]);

  const variantPrice = useMemo(() => {
    return variant.variant_price ?? productPrice;
  }, [variant.variant_price, productPrice]);

  const isAvailable = useMemo(() => {
    return variant.variant_stock > 0;
  }, [variant.variant_stock]);

  return {
    variantImages,
    variantPrice,
    isAvailable,
  };
}

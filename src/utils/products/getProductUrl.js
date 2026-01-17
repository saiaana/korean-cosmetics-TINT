import ROUTES from "../../constants/routes";
import { getProductSlug } from "./getProductSlug";

export function getProductUrl(productId, productTitle, variantId = null) {
  const productSlug = getProductSlug(productId, productTitle);
  const baseUrl = ROUTES.product(productSlug);

  if (variantId) {
    return `${baseUrl}?variantId=${variantId}`;
  }

  return baseUrl;
}

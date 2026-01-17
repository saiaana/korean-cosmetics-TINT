import { getCurrentHostname, getCurrentProtocol } from "../config/api.js";

export function getFinalPrice(price, discountPercent, isOnSale) {
  if (!isOnSale || !discountPercent) {
    return price.toFixed(2);
  }
  const discount = discountPercent / 100;
  return Math.round(price * (1 - discount), 0).toFixed(2);
}

export function getImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return imageUrl;

  const currentHost = getCurrentHostname();

  if (
    imageUrl.startsWith("http") &&
    !imageUrl.includes("localhost") &&
    !imageUrl.includes("127.0.0.1")
  ) {
    return imageUrl;
  }

  if (imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1")) {
    const currentProtocol = getCurrentProtocol();

    let newUrl = imageUrl.replace(
      /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/,
      (match, host, port) => {
        return `${currentProtocol}//${currentHost}${port || ""}`;
      },
    );

    return newUrl;
  }

  return imageUrl;
}

export function getMainImageUrl(images) {
  return getImageUrl(images?.find((img) => img.is_main)?.url);
}

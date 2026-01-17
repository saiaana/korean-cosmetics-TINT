import { getStockStatus } from "../utils/products/getStockStatus";

export function useProductStock(activeItem) {
  const stock = activeItem?.stock ?? null;
  const status = getStockStatus(stock);

  return { stock, status, isOutOfStock: status === "Out of Stock" };
}

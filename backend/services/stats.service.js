import * as orderRepo from "../repositories/order.repository.js";

export async function getPopularProducts(limit = 10) {
  return orderRepo.findPopularProductsLast12Months(limit);
}

import * as productsRepo from "../repositories/products.repository.js";

export const getAllProducts = () => productsRepo.findAllProducts();

export const getAllBrands = () => productsRepo.findAllBrands();

export const getProductsByCategory = (category, page, limit) =>
  productsRepo.findProductsByCategory(category, page, limit);

export const getProductsByBrand = (brand, page, limit) =>
  productsRepo.findProductsByBrand(brand, page, limit);

export const getNewProducts = (page, limit) =>
  productsRepo.findNewProducts(page, limit);

export const getOnSaleProducts = (page, limit) =>
  productsRepo.findOnSaleProducts(page, limit);

export const getBestsellerProducts = (page, limit) =>
  productsRepo.findBestsellerProducts(page, limit);

export const getProductBySlug = async (slug) => {
  const product = await productsRepo.findProductBySlug(slug);
  if (!product) {
    throw { status: 404, message: "Product not found" };
  }
  return product;
};

export const searchProducts = (search) => {
  if (!search || search.trim().length < 2) {
    return [];
  }
  return productsRepo.searchProducts(search);
};

export const getSimilarProducts = (category, brand, excludeId) =>
  productsRepo.findSimilarProducts(category, brand, excludeId);

export const getCategoriesList = () => productsRepo.findCategoriesList();

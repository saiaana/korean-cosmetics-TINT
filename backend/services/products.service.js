import * as productsRepo from "../repositories/products.repository.js";

export const getAllProducts = () => productsRepo.findAllProducts();

export const getAllAdminProducts = () => productsRepo.findAllAdminProducts();

export const getAdminProductById = (productId) => {
  const product = productsRepo.findAdminProductById(productId);
  if (!product) {
    throw { status: 404, message: "Product not found" };
  }
  return product;
};

export const updateProductActiveStatus = (productId, isActive) =>
  productsRepo.updateProductActiveStatus(productId, isActive);

export const updateProduct = (productId, productData) => {
  // Валидация обязательных полей
  if (!productData.title || !productData.brand || !productData.price || !productData.product_category) {
    throw { status: 400, message: "Missing required fields: title, brand, price, product_category" };
  }

  // Цена хранится в долларах
  const price = typeof productData.price === 'number' 
    ? productData.price 
    : parseFloat(productData.price) || 0;

  return productsRepo.updateProduct(productId, {
    ...productData,
    price: price,
  });
};

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

export const createProduct = (productData) => {
  if (!productData.title || !productData.brand || !productData.price || !productData.product_category) {
    throw { status: 400, message: "Missing required fields: title, brand, price, product_category" };
  }

  const price = typeof productData.price === 'number' 
    ? productData.price 
    : parseFloat(productData.price) || 0;

  return productsRepo.createProduct({
    ...productData,
    price: price,
  });
};

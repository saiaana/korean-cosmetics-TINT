import express from "express";
import {
  getAllBrands,
  getAllProducts,
  getAllAdminProducts,
  getAdminProductById,
  getBestsellerProducts,
  getCategoriesList,
  getNewProducts,
  getOnSaleProducts,
  getProductBySlug,
  getProductsByBrand,
  getProductsByCategory,
  getSimilarProducts,
  searchProducts,
  createProduct,
  updateProductActiveStatus,
  updateProduct,
} from "../controllers/productsController.js";
import { getProductVariants } from "../controllers/productVariantsController.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/all", getAllProducts);
router.get("/brands", getAllBrands);
router.get("/brands/:brand", getProductsByBrand);
router.get("/categories/:category", getProductsByCategory);
router.get("/new", getNewProducts);
router.get("/on-sale", getOnSaleProducts);
router.get("/bestsellers", getBestsellerProducts);
router.get("/similar", getSimilarProducts);
router.get("/categoriesList", getCategoriesList);
router.get("/slug/:slug", getProductBySlug);
router.get("/admin/all", getAllAdminProducts);
router.get("/admin/:productId", getAdminProductById);
router.put("/:productId/active", updateProductActiveStatus);
router.put("/:productId", updateProduct);
router.get("/:productId/variants", getProductVariants);
router.post("/", createProduct);
router.get("/", getAllProducts);

export default router;

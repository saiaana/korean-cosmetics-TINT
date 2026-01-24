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
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// Public routes
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
router.get("/:productId/variants", getProductVariants);
router.get("/", getAllProducts);

// Admin routes - только для admin
router.get("/admin/all", authenticateToken, requireRole(["admin"]), getAllAdminProducts);
router.get("/admin/:productId", authenticateToken, requireRole(["admin"]), getAdminProductById);
router.put("/:productId/active", authenticateToken, requireRole(["admin"]), updateProductActiveStatus);
router.put("/:productId", authenticateToken, requireRole(["admin"]), updateProduct);
router.post("/", authenticateToken, requireRole(["admin"]), createProduct);

export default router;

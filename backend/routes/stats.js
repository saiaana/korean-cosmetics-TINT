import express from "express";
import { getPopularProducts } from "../controllers/statsController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// Statistics - только для admin
router.get("/popular-products", authenticateToken, requireRole(["admin"]), getPopularProducts);

export default router;

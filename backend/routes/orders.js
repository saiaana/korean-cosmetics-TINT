import express from "express";
import {
  getOrderById,
  getOrdersByUser,
  createOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/ordersController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// User routes (специфичные роуты должны быть выше общих)
router.get("/user/:firebaseUid", getOrdersByUser);
router.post("/", authenticateToken, createOrder);

// Admin routes - доступ для manager и admin
router.get("/all", authenticateToken, requireRole(["admin", "manager"]), getAllOrders);
router.put("/:orderId/status", authenticateToken, requireRole(["admin", "manager"]), updateOrderStatus);

// General routes
router.get("/:orderId", getOrderById);

export default router;

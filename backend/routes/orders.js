import express from "express";
import {
  getOrderById,
  getOrdersByUser,
  createOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/ordersController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// User routes (специфичные роуты должны быть выше общих)
router.get("/user/:firebaseUid", getOrdersByUser);
router.post("/", authenticateToken, createOrder);

// Admin routes (можно добавить проверку на админа позже)
router.get("/all", getAllOrders);
router.put("/:orderId/status", updateOrderStatus);

// General routes
router.get("/:orderId", getOrderById);

export default router;

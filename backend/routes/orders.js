import express from "express";
import {
  getOrderById,
  getOrdersByUser,
  createOrder,
} from "../controllers/ordersController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:orderId", getOrderById);
router.get("/user/:firebaseUid", getOrdersByUser);
router.post("/", authenticateToken, createOrder);

export default router;

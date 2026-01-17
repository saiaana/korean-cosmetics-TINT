import express from "express";
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCartItemsByUserId,
  mergeGuestCart,
  updateCartItem,
} from "../controllers/cartControllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getCartItemsByUserId);
router.post("/", authenticateToken, addToCart);
router.patch("/:productId", authenticateToken, updateCartItem);
router.delete("/:productId", authenticateToken, deleteCartItem);
router.delete("/", authenticateToken, clearCart);
router.post("/merge", authenticateToken, mergeGuestCart);

export default router;

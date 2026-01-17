import * as cartService from "../services/cart.service.js";

export async function getCartItemsByUserId(req, res) {
  try {
    const firebaseUid = req.user.uid;
    const cartItems = await cartService.getCartItemsByUserId(firebaseUid);
    res.json(cartItems);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function addToCart(req, res) {
  try {
    const firebaseUid = req.user.uid;
    const { productId, quantity = 1, variantId } = req.body;
    await cartService.addToCart(firebaseUid, productId, quantity, variantId);
    res.status(201).json({ message: "Added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    const firebaseUid = req.user.uid;
    const { productId } = req.params;
    const { quantity, variantId } = req.body;
    await cartService.updateCartItem(
      firebaseUid,
      productId,
      quantity,
      variantId,
    );
    res.json({ message: "Cart item updated" });
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function deleteCartItem(req, res) {
  try {
    const firebaseUid = req.user.uid;
    const { productId } = req.params;
    const { variantId } = req.query;
    await cartService.deleteCartItem(firebaseUid, productId, variantId);
    res.json({ message: "Cart item deleted" });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function clearCart(req, res) {
  try {
    const firebaseUid = req.user.uid;
    await cartService.clearCart(firebaseUid);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function mergeGuestCart(req, res) {
  try {
    const firebaseUid = req.user.uid;
    const items = req.body;
    const result = await cartService.mergeGuestCart(firebaseUid, items);
    res.json(result);
  } catch (err) {
    console.error("Error merging cart:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

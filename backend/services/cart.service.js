import * as userRepo from "../repositories/user.repository.js";
import * as cartRepo from "../repositories/cart.repository.js";
import db from "../db.js";

export async function getCartItemsByUserId(firebaseUid) {
  const user = await userRepo.findByFirebaseUid(firebaseUid);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return await cartRepo.findCartItemsByUserId(user.id);
}

export async function addToCart(firebaseUid, productId, quantity, variantId) {
  const user = await userRepo.findByFirebaseUid(firebaseUid);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const existingItem = await cartRepo.findCartItem(
    user.id,
    productId,
    variantId || null,
  );

  if (existingItem) {
    await cartRepo.updateCartItemQuantity(
      user.id,
      productId,
      variantId || null,
      quantity,
    );
  } else {
    await cartRepo.addCartItem(user.id, productId, variantId || null, quantity);
  }
}

export async function updateCartItem(
  firebaseUid,
  productId,
  quantity,
  variantId,
) {
  if (!quantity || quantity < 1) {
    throw { status: 400, message: "Quantity must be greater than 0" };
  }

  const user = await userRepo.findByFirebaseUid(firebaseUid);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  await cartRepo.setCartItemQuantity(
    user.id,
    productId,
    variantId || null,
    quantity,
  );
}

export async function deleteCartItem(firebaseUid, productId, variantId) {
  const user = await userRepo.findByFirebaseUid(firebaseUid);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  await cartRepo.deleteCartItem(user.id, productId, variantId || null);
}

export async function clearCart(firebaseUid) {
  const user = await userRepo.findByFirebaseUid(firebaseUid);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  await cartRepo.clearCartItems(user.id);
}

export async function mergeGuestCart(firebaseUid, items) {
  if (!Array.isArray(items)) {
    throw { status: 400, message: "Invalid cart format" };
  }

  const user = await userRepo.findByFirebaseUid(firebaseUid);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    for (const item of items) {
      await cartRepo.mergeCartItem(
        client,
        user.id,
        item.product_id,
        item.variant_id || null,
        item.quantity,
      );
    }

    await client.query("COMMIT");

    const cartRes = await db.query(
      `
      SELECT ci.product_id, ci.quantity, p.price
      FROM cart_items ci
      JOIN catalog p ON p.id = ci.product_id
      WHERE ci.user_id = $1
      `,
      [user.id],
    );

    return cartRes.rows;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

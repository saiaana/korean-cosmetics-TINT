import { createOrder } from "../../api/ordersApi";
import ROUTES from "../../constants/routes";
import { isValidEmail, areAllFieldsFilled } from "../validation";
import { getCartItemKey } from "../cart/getCartItemKey";

export async function handleCheckout(
  formData,
  cart,
  auth,
  dispatch,
  navigate,
  deleteSelectedItems,
) {
  const cleanedData = Object.fromEntries(
    Object.entries(formData).map(([key, val]) => [key, val.trim()]),
  );

  if (!isValidEmail(cleanedData.email)) {
    alert("Please enter valid email address.");
    return;
  }

  if (!areAllFieldsFilled(cleanedData)) {
    alert("All fields must be filled.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to place an order");
    return;
  }

  const itemsWithFinalPrice = cart.map((item) => {
    const finalPrice = item.finalPrice ?? Number(item.price);

    return {
      id: item.product_id || item.id,
      variantId: item.variant_id ?? null,
      price: finalPrice,
      quantity: item.quantity,
    };
  });

  const orderData = {
    customer: cleanedData,
    items: itemsWithFinalPrice,
  };

  try {
    const token = await user.getIdToken();
    const result = await createOrder(orderData, token);

    const selectedKeys = cart.map((item) =>
      getCartItemKey(item.product_id || item.id, item.variant_id || null),
    );
    await dispatch(deleteSelectedItems(selectedKeys));

    navigate(ROUTES.orderConfirmation(result.orderId));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Checkout error:", error);
    }
    alert(error.message || "Failed to place order. Please try again.");
  }
}

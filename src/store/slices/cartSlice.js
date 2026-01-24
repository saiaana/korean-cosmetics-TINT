import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  deleteCartItem as deleteCartItemApi,
  clearCart as clearCartApi,
} from "../../api/cartApi";
import { mergeGuestCart as mergeGuestCartApi } from "../../api/cartApi";
import { normalizeCartItem } from "../../utils/cart/normalizeCartItem";
import { checkItemUnavailable } from "../../utils/products/checkItemUnavailable";
import { getCartItemKey } from "../../utils/cart/getCartItemKey";

import {
  getCartFromStorage,
  setCartToStorage,
  removeCartFromStorage,
} from "../../features/cart/lib/cartStorage";

import {
  addGuestItem,
  updateGuestItem,
  deleteGuestItem,
} from "../../features/cart/lib/guestCartReducer";

import { getAuthToken } from "../../features/cart/cartAuth";

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const token = await getAuthToken();
    return await getCart(token);
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, variantId, quantity = 1, productData }, { getState }) => {
    const { cart } = getState();

    if (cart.source === "user") {
      const token = await getAuthToken();
      await addToCartApi(token, productId, quantity, variantId);
      return await getCart(token);
    }

    return { productId, variantId, quantity, productData };
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity, variantId }, { getState }) => {
    const { cart } = getState();

    if (cart.source === "user") {
      const token = await getAuthToken();
      await updateCartItemApi(token, productId, quantity, variantId);
      return await getCart(token);
    }

    return { productId, quantity, variantId };
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ productId, variantId }, { getState }) => {
    const { cart } = getState();

    if (cart.source === "user") {
      const token = await getAuthToken();
      await deleteCartItemApi(token, productId, variantId);
      return await getCart(token);
    }

    return { productId, variantId };
  }
);

export const clearCartItems = createAsyncThunk(
  "cart/clearCartItems",
  async (_, { getState }) => {
    const { cart } = getState();

    if (cart.source === "user") {
      const token = await getAuthToken();
      await clearCartApi(token);
      return [];
    }

    return [];
  }
);

export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async () => {
    const guestCartRaw = getCartFromStorage();
    if (guestCartRaw.length === 0) return [];

    const guestCart = guestCartRaw.map((item) => ({
      product_id: item.product_id,
      ...(item.variant_id != null && { variant_id: item.variant_id }),
      quantity: item.quantity,
    }));

    const token = await getAuthToken();
    await mergeGuestCartApi(token, guestCart);

    removeCartFromStorage();
    return await getCart(token);
  }
);

export const deleteSelectedCartItems = createAsyncThunk(
  "cart/deleteSelectedCartItems",
  async (selectedKeys, { getState }) => {
    const { cart } = getState();

    // GUEST
    if (cart.source === "guest") {
      const nextItems = cart.items.filter(
        (item) =>
          !selectedKeys.includes(
            getCartItemKey(item.product_id, item.variant_id)
          )
      );
      setCartToStorage(nextItems);
      return nextItems;
    }

    // USER
    const token = await getAuthToken();
    for (const key of selectedKeys) {
      const [productId, variantId] = key.split("-");
      await deleteCartItemApi(
        token,
        Number(productId),
        variantId != null ? Number(variantId) : null
      );
    }

    return await getCart(token);
  }
);

const initialState = {
  items: getCartFromStorage(),
  source: "guest",
  selected: {},
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleSelected(state, action) {
      const key = action.payload;
      state.selected[key] = !state.selected[key];
    },
    clearSelection(state) {
      state.selected = {};
    },
    selectAll(state) {
      state.items.forEach((item) => {
        const isUnavailable = checkItemUnavailable(item);

        if (!isUnavailable) {
          const key = getCartItemKey(item.product_id, item.variant_id);
          state.selected[key] = true;
        }
      });
    },
    unselectAll(state) {
      state.selected = {};
    },
    resetCart(state) {
      state.items = [];
      state.selected = {};
      state.status = "idle";
      state.error = null;
      state.source = "guest";
      removeCartFromStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload.map(normalizeCartItem);
        state.source = "user";
        state.selected = {};
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        if (state.source === "user") {
          state.items = action.payload.map(normalizeCartItem);
        } else {
          state.items = addGuestItem(state.items, action.payload);
          setCartToStorage(state.items);
        }
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.source === "user") {
          state.items = action.payload.map(normalizeCartItem);
        } else {
          state.items = updateGuestItem(state.items, action.payload);
          setCartToStorage(state.items);
        }
      })

      .addCase(deleteCartItem.fulfilled, (state, action) => {
        if (state.source === "user") {
          state.items = action.payload.map(normalizeCartItem);
        } else {
          state.items = deleteGuestItem(state.items, action.payload);
          setCartToStorage(state.items);
        }
      })

      .addCase(clearCartItems.fulfilled, (state) => {
        state.items = [];
        state.selected = {};
        removeCartFromStorage();
      })

      .addCase(deleteSelectedCartItems.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload)
          ? action.payload.map(normalizeCartItem)
          : action.payload;
        state.selected = {};
      })

      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.items = action.payload.map(normalizeCartItem);
        state.source = "user";
        state.selected = {};
      });
  },
});

export const {
  toggleSelected,
  selectAll,
  unselectAll,
  clearSelection,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;

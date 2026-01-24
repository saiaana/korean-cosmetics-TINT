import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductVariants } from "../../api/productsApi";

export const fetchProductVariants = createAsyncThunk(
  "variants/fetchByProductId",
  async (productId) => {
    const data = await getProductVariants(productId);
    return data.variants || [];
  }
);

const initialState = {
  variants: [],
  variantsStatus: "idle",
  error: null,
  selectedVariant: null,
};

const variantsSlice = createSlice({
  name: "variants",
  initialState,
  reducers: {
    setSelectedVariant(state, action) {
      state.selectedVariant = action.payload;
    },
    clearVariants(state) {
      state.variants = [];
      state.variantsStatus = "idle";
      state.error = null;
      state.selectedVariant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductVariants.pending, (state) => {
        state.variantsStatus = "loading";
        state.error = null;
        state.variants = [];
        state.selectedVariant = null;
      })
      .addCase(fetchProductVariants.fulfilled, (state, action) => {
        state.variantsStatus = "succeeded";
        state.variants = action.payload;
      })
      .addCase(fetchProductVariants.rejected, (state, action) => {
        state.variantsStatus = "failed";
        state.error = action.error.message;
        state.variants = [];
        state.selectedVariant = null;
      });
  },
});

export const { setSelectedVariant, clearVariants } = variantsSlice.actions;
export default variantsSlice.reducer;

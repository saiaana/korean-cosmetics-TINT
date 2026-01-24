import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchProducts as searchProductsApi } from "../../api/productsApi";

export const searchProducts = createAsyncThunk(
  "search/products",
  async ({ query, signal }, { rejectWithValue }) => {
    try {
      return await searchProductsApi(query, signal);
    } catch (error) {
      if (error.name === "AbortError") {
        return rejectWithValue("Request aborted");
      }
      throw error;
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    clearSearch(state) {
      state.query = "";
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        if (action.payload === "Request aborted") {
          return;
        }
        state.loading = false;
        state.error = action.error.message || "Search error";
        state.results = [];
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;

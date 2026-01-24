import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";

import {
  getAllBrands,
  getBestsellerProducts,
  getNewProducts,
  getOnSaleProducts,
  getProductBySlug,
  getProductsByBrand,
  getProductsByCategory,
  getSimilarProducts,
} from "../../api/productsApi";
import { getCategories } from "../../api/productsApi";

import {
  normalizeProducts,
  normalizeProduct,
} from "../../utils/products/normalizeProduct";

function createPaginatedList() {
  return {
    ids: [],
    page: 1,
    limit: 12,
    hasMore: true,
    status: "idle",
    error: null,
  };
}
// dedupeIds: keep order, but remove duplicates
function mergeUniqueIds(prevIds, nextIds) {
  const set = new Set(prevIds);
  const merged = [...prevIds];
  for (const id of nextIds) {
    if (!set.has(id)) {
      set.add(id);
      merged.push(id);
    }
  }
  return merged;
}

const productsAdapter = createEntityAdapter({
  selectId: (product) => product.id,
});

const initialState = {
  products: productsAdapter.getInitialState(),
  productPage: {
    id: null,
    status: "idle",
    error: null,
  },

  lists: {
    newProducts: createPaginatedList(),
    onSaleProducts: createPaginatedList(),
    bestsellerProducts: createPaginatedList(),
    productsByCategory: createPaginatedList(),
    productsByBrand: createPaginatedList(),

    similarProducts: { ids: [], status: "idle", error: null },
  },

  brands: { data: [], status: "idle", error: null },
  categories: { data: [], status: "idle", error: null },
};

export const fetchBrands = createAsyncThunk(
  "products/fetchBrands",
  async () => {
    return await getAllBrands();
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    return await getCategories();
  }
);

export const fetchNewProducts = createAsyncThunk(
  "products/fetchNewProducts",
  async ({ page = 1, limit = 12, append = false } = {}) => {
    const response = await getNewProducts(page, limit);
    return { ...response, append };
  }
);

export const fetchOnSaleProducts = createAsyncThunk(
  "products/fetchOnSaleProducts",
  async ({ page = 1, limit = 12, append = false } = {}) => {
    const response = await getOnSaleProducts(page, limit);
    return { ...response, append };
  }
);

export const fetchBestsellerProducts = createAsyncThunk(
  "products/fetchBestsellerProducts",
  async ({ page = 1, limit = 12, append = false } = {}) => {
    const response = await getBestsellerProducts(page, limit);
    return { ...response, append };
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async ({ category, page = 1, limit = 12, append = false }) => {
    const response = await getProductsByCategory(category, page, limit);
    return { ...response, append };
  }
);

export const fetchProductsByBrand = createAsyncThunk(
  "products/fetchProductsByBrand",
  async ({ brand, page = 1, limit = 12, append = false }) => {
    const response = await getProductsByBrand(brand, page, limit);
    return { ...response, append };
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ category, brand, excludeId }) => {
    return await getSimilarProducts({ category, brand, excludeId });
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug) => await getProductBySlug(slug)
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetList(state, action) {
      const key = action.payload;
      if (!state.lists[key]) return;

      if ("page" in state.lists[key]) {
        state.lists[key] = createPaginatedList();
      } else {
        state.lists[key] = { ids: [], status: "idle", error: null };
      }
    },
  },
  extraReducers: (builder) => {
    const handlePaginated = (key) => {
      builder
        .addCase(key.pending, (state, action) => {
          const isAppend = Boolean(action.meta.arg?.append);
          state.lists[keyKeyMap[key.typePrefix]].status = isAppend
            ? "fetchingMore"
            : "loading";
          state.lists[keyKeyMap[key.typePrefix]].error = null;
        })
        .addCase(key.fulfilled, (state, action) => {
          const listKey = keyKeyMap[key.typePrefix];
          const { products, page, hasMore, append } = action.payload;

          const safeProducts = Array.isArray(products)
            ? normalizeProducts(products)
            : [];

          productsAdapter.upsertMany(state.products, safeProducts);

          const nextIds = safeProducts.map((p) => p.id);

          if (append) {
            state.lists[listKey].ids = mergeUniqueIds(
              state.lists[listKey].ids,
              nextIds
            );
            state.lists[listKey].page = page;
          } else {
            state.lists[listKey].ids = nextIds;
            state.lists[listKey].page = page;
            state.lists[listKey].limit = action.meta.arg?.limit || 12;
          }

          state.lists[listKey].hasMore = hasMore;
          state.lists[listKey].status = "succeeded";
        })
        .addCase(key.rejected, (state, action) => {
          const listKey = keyKeyMap[key.typePrefix];
          state.lists[listKey].status = "failed";
          state.lists[listKey].error = action.error.message;
        });
    };

    const keyKeyMap = {
      "products/fetchNewProducts": "newProducts",
      "products/fetchOnSaleProducts": "onSaleProducts",
      "products/fetchBestsellerProducts": "bestsellerProducts",
      "products/fetchProductsByCategory": "productsByCategory",
      "products/fetchProductsByBrand": "productsByBrand",
    };

    handlePaginated(fetchNewProducts);
    handlePaginated(fetchOnSaleProducts);
    handlePaginated(fetchBestsellerProducts);
    handlePaginated(fetchProductsByCategory);
    handlePaginated(fetchProductsByBrand);

    // Similar products
    builder
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.lists.similarProducts.status = "loading";
        state.lists.similarProducts.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        const safeProducts = Array.isArray(action.payload)
          ? normalizeProducts(action.payload)
          : [];

        productsAdapter.upsertMany(state.products, safeProducts);
        state.lists.similarProducts.ids = safeProducts.map((p) => p.id);
        state.lists.similarProducts.status = "succeeded";
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.lists.similarProducts.status = "failed";
        state.lists.similarProducts.error = action.error.message;
      });

    // Product page
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.productPage.status = "loading";
        state.productPage.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        const safeProduct = action.payload
          ? normalizeProduct(action.payload)
          : null;

        if (safeProduct) {
          productsAdapter.upsertOne(state.products, safeProduct);
          state.productPage.id = safeProduct.id;
          state.productPage.status = "succeeded";
        } else {
          state.productPage.id = null;
          state.productPage.status = "failed";
          state.productPage.error = "Product not found";
        }
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.productPage.status = "failed";
        state.productPage.error = action.error.message;
      });

    // Brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.brands.status = "loading";
        state.brands.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands.data = action.payload || [];
        state.brands.status = "succeeded";
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.brands.status = "failed";
        state.brands.error = action.error.message;
      });

    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = "loading";
        state.categories.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.data = action.payload || [];
        state.categories.status = "succeeded";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.error.message;
      });
  },
});

export const { resetList } = productsSlice.actions;

const selectProductsEntities = (state) => state.products.products.entities;
const selectLists = (state) => state.products.lists;

const selectList = (listKey) =>
  createSelector([selectLists], (lists) => lists[listKey]);

const selectListIds = (listKey) =>
  createSelector([selectList(listKey)], (list) => list?.ids ?? []);

export const selectProductsByList = (listKey) =>
  createSelector(
    [selectListIds(listKey), selectProductsEntities],
    (ids, entities) => ids.map((id) => entities[id]).filter(Boolean)
  );

export const selectListStatus = (listKey) =>
  createSelector([selectList(listKey)], (list) => list?.status ?? "idle");

export const selectListPagination = (listKey) =>
  createSelector([selectList(listKey)], (list) => ({
    page: list?.page ?? 1,
    limit: list?.limit ?? 12,
    hasMore: list?.hasMore ?? false,
  }));

export const selectNewProducts = selectProductsByList("newProducts");
export const selectOnSaleProducts = selectProductsByList("onSaleProducts");
export const selectBestsellerProducts =
  selectProductsByList("bestsellerProducts");
export const selectProductsByCategory =
  selectProductsByList("productsByCategory");
export const selectProductsByBrand = selectProductsByList("productsByBrand");
export const selectSimilarProducts = selectProductsByList("similarProducts");

export const selectNewProductsStatus = selectListStatus("newProducts");
export const selectOnSaleProductsStatus = selectListStatus("onSaleProducts");
export const selectBestsellerProductsStatus =
  selectListStatus("bestsellerProducts");
export const selectProductsByCategoryStatus =
  selectListStatus("productsByCategory");
export const selectProductsByBrandStatus = selectListStatus("productsByBrand");

const selectProductPageId = (state) => state.products.productPage.id;

export const selectCurrentProduct = createSelector(
  [selectProductPageId, selectProductsEntities],
  (id, entities) => (id ? (entities[id] ?? null) : null)
);

export const selectCurrentProductStatus = (state) =>
  state.products.productPage.status;

const selectBrandsState = (state) => state.products.brands;
const selectCategoriesState = (state) => state.products.categories;

export const selectBrands = createSelector(
  [selectBrandsState],
  (brandsState) => brandsState?.data || []
);

export const selectBrandsStatus = createSelector(
  [selectBrandsState],
  (brandsState) => brandsState?.status || "idle"
);

export const selectCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.data || []
);

export const selectCategoriesStatus = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState?.status || "idle"
);

export default productsSlice.reducer;

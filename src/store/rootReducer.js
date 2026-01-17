import { combineReducers } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import searchReducer from "./slices/searchSlice";
import authReducer from "./slices/authSlice";
import variantsReducer from "./slices/variantsSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  search: searchReducer,
  auth: authReducer,
  variants: variantsReducer,
});

export default rootReducer;

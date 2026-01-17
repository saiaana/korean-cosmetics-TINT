import { onAuthStateChanged } from "firebase/auth";
import { setUser, clearUser } from "../store/slices/authSlice.js";
import { auth } from "../../firebase.js";
import store from "../store/index.js";
import { fetchCartItems, resetCart } from "../store/slices/cartSlice.js";

let initialized = false;

export function initAuthListener() {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      store.dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }),
      );
      await store.dispatch(fetchCartItems());
    } else {
      store.dispatch(clearUser());
      store.dispatch(resetCart());
    }
  });
}

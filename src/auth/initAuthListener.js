import { onAuthStateChanged } from "firebase/auth";
import { setUser, clearUser } from "../store/slices/authSlice.js";
import { auth } from "../../firebase.js";
import store from "../store/index.js";
import { fetchCartItems, resetCart } from "../store/slices/cartSlice.js";
import { getCurrentUser } from "../api/usersApi.js";
import { getAuthToken } from "../features/cart/cartAuth.js";

let initialized = false;

export function initAuthListener() {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Получаем токен и данные пользователя из БД (включая role)
        const token = await getAuthToken();
        const userData = await getCurrentUser(token);
        
        store.dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: userData.role || "user",
            firstName: userData.first_name,
            lastName: userData.last_name,
          })
        );
        await store.dispatch(fetchCartItems());
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Если не удалось получить данные из БД, сохраняем только Firebase данные
        store.dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: "user", // По умолчанию
          })
        );
        await store.dispatch(fetchCartItems());
      }
    } else {
      store.dispatch(clearUser());
      store.dispatch(resetCart());
    }
  });
}

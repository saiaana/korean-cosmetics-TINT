# Документация по аутентификации

## Обзор

Проект использует **Firebase Authentication** для управления пользователями и **JWT токены** для авторизации API запросов.

## Архитектура аутентификации

### Frontend → Backend поток:

1. Пользователь регистрируется/входит через Firebase Auth
2. Firebase возвращает JWT токен
3. Токен сохраняется в Firebase SDK
4. При API запросах токен отправляется в заголовке `Authorization: Bearer <token>`
5. Backend верифицирует токен через Firebase Admin SDK

---

## Frontend

### Инициализация

Аутентификация инициализируется в `src/auth/initAuthListener.js`:

```javascript
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Пользователь авторизован
    store.dispatch(setUser({ uid, email, displayName }));
    await store.dispatch(fetchCartItems());
  } else {
    // Пользователь не авторизован
    store.dispatch(clearUser());
    store.dispatch(resetCart());
  }
});
```

### Регистрация

**Файл:** `src/auth/signUpUser.js`

**Процесс:**

1. Создание пользователя в Firebase через `createUserWithEmailAndPassword`
2. Обновление профиля с именем
3. Создание записи в базе данных через API
4. Сохранение пользователя в Redux store

**Пример использования:**

```javascript
import { signUpUser } from "../auth/signUpUser";

await signUpUser({
  email: "user@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
});
```

### Вход

**Хук:** `src/hooks/useLogin.js`

**Процесс:**

1. Авторизация через `signInWithEmailAndPassword`
2. Получение токена через `getIdToken()`
3. Сохранение пользователя в Redux store
4. Загрузка корзины пользователя

### Получение токена

**Файл:** `src/features/cart/cartAuth.js`

```javascript
export async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}
```

### Состояние аутентификации в Redux

**Слайс:** `src/store/slices/authSlice.js`

```javascript
{
  user: {
    uid: "firebase-uid",
    email: "user@example.com",
    displayName: "John Doe"
  } | null,
  initialized: true | false
}
```

**Селекторы:**

- `state.auth.user` - данные пользователя
- `state.auth.initialized` - флаг инициализации (завершена ли проверка auth)

---

## Backend

### Middleware аутентификации

**Файл:** `backend/middleware/auth.js`

```javascript
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Добавляет данные пользователя в запрос
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
```

### Использование в маршрутах

```javascript
import { authenticateToken } from "../middleware/auth.js";

router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getCartItemsByUserId);
```

### Данные пользователя в запросе

После прохождения middleware, в `req.user` доступны:

```javascript
{
  uid: "firebase-uid",
  email: "user@example.com",
  email_verified: true,
  // ... другие поля Firebase токена
}
```

---

## Защищенные endpoints

Следующие endpoints требуют аутентификации:

### Cart API

- `GET /api/cart` - получить корзину
- `POST /api/cart` - добавить в корзину
- `PATCH /api/cart/:productId` - обновить корзину
- `DELETE /api/cart/:productId` - удалить из корзины
- `DELETE /api/cart` - очистить корзину
- `POST /api/cart/merge` - объединить корзины

### Orders API

- `POST /api/orders` - создать заказ

### Users API

- `GET /api/users/me` - получить текущего пользователя

---

## Гостевые пользователи

### Корзина для гостей

Неавторизованные пользователи могут использовать корзину через **localStorage**:

**Хранение:**

```javascript
localStorage.setItem("guestCart", JSON.stringify(cartItems));
```

**Объединение:**
При регистрации/входе гостовая корзина автоматически объединяется с корзиной пользователя через endpoint `POST /api/cart/merge`.

---

## Создание пользователя в БД

При регистрации создается запись в таблице `users`:

**API:** `POST /api/users`

**Параметры:**

```json
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Backend проверяет:**

- Существует ли пользователь с таким `firebase_uid`
- Если существует - обновляет данные
- Если не существует - создает новую запись

---

## Обновление профиля пользователя

Профиль обновляется автоматически при оформлении заказа:

```javascript
await userRepo.updateUserProfile(
  client,
  user.id,
  customer.firstName,
  customer.lastName,
  customer.email,
);
```

---

## Обработка ошибок

### Frontend:

- Ошибки Firebase отображаются пользователю
- `auth/email-already-in-use` - email уже используется
- `auth/invalid-email` - неверный формат email
- `auth/weak-password` - слабый пароль

### Backend:

- `401 Unauthorized` - отсутствует токен или токен недействителен
- `404 User not found` - пользователь не найден в БД (для некоторых endpoints возвращается пустой массив)

---

## Безопасность

1. **JWT токены** - временные токены с истечением срока действия
2. **Верификация токенов** - каждый защищенный запрос проверяет токен через Firebase Admin SDK
3. **HTTPS** - рекомендуется использовать HTTPS в production
4. **CORS** - настройка CORS для защиты от неавторизованных источников

---

## Переменные окружения

### Frontend:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Backend:

Требуется файл сервисного аккаунта Firebase или переменные окружения для Firebase Admin SDK.

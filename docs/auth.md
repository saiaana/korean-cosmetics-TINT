# Authentication Documentation

## Overview

The project uses **Firebase Authentication** for user management and **JWT tokens** for API request authorization.

## Authentication Architecture

### Frontend → Backend Flow:

1. User registers/logs in through Firebase Auth
2. Firebase returns a JWT token
3. Token is stored in Firebase SDK
4. On API requests, token is sent in the `Authorization: Bearer <token>` header
5. Backend verifies the token through Firebase Admin SDK

---

## Frontend

### Initialization

Authentication is initialized in `src/auth/initAuthListener.js`:

```javascript
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      // Get token and user data from DB (including role)
      const token = await getAuthToken();
      const userData = await getCurrentUser(token);
      
      store.dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: userData.role || "user",  // Role from DB
        firstName: userData.first_name,
        lastName: userData.last_name,
      }));
      await store.dispatch(fetchCartItems());
    } catch (error) {
      // If failed to get data from DB, save only Firebase data
      store.dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "user", // Default
      }));
      await store.dispatch(fetchCartItems());
    }
  } else {
    // User is not authenticated
    store.dispatch(clearUser());
    store.dispatch(resetCart());
  }
});
```

### Registration

**File:** `src/auth/signUpUser.js`

**Process:**

1. Create user in Firebase via `createUserWithEmailAndPassword`
2. Update profile with name
3. Create database record via API
4. Save user to Redux store

**Usage Example:**

```javascript
import { signUpUser } from "../auth/signUpUser";

await signUpUser({
  email: "user@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
});
```

### Login

**Hook:** `src/hooks/useLogin.js`

**Process:**

1. Authenticate via `signInWithEmailAndPassword`
2. Get token via `getIdToken()`
3. Save user to Redux store
4. Load user's cart

### Getting Token

**File:** `src/features/cart/cartAuth.js`

```javascript
export async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}
```

### Authentication State in Redux

**Slice:** `src/store/slices/authSlice.js`

```javascript
{
  user: {
    uid: "firebase-uid",
    email: "user@example.com",
    displayName: "John Doe",
    role: "user" | "manager" | "admin",  // User role
    firstName: "John",
    lastName: "Doe"
  } | null,
  initialized: true | false
}
```

**Selectors:**

- `state.auth.user` - user data (including role)
- `state.auth.initialized` - initialization flag (whether auth check is complete)

**Important:** User role (`role`) is retrieved from the database during authentication initialization via the `/api/users/me` API.

---

## Backend

### Authentication Middleware

**File:** `backend/middleware/auth.js`

```javascript
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Adds user data to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
```

### Role Checking Middleware

**File:** `backend/middleware/role.js`

```javascript
import * as userService from "../services/user.service.js";

export function requireRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await userService.getCurrentUser(req.user.uid);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      }

      req.userData = user; // Add user data from DB
      next();
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
```

### Usage in Routes

```javascript
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

// Simple authentication
router.post("/", authenticateToken, createOrder);

// Authentication + role check
router.get("/admin/all", authenticateToken, requireRole(["admin"]), getAllAdminProducts);
router.get("/all", authenticateToken, requireRole(["admin", "manager"]), getAllOrders);
```

### User Data in Request

After passing middleware, `req.user` contains:

```javascript
{
  uid: "firebase-uid",
  email: "user@example.com",
  email_verified: true,
  // ... other Firebase token fields
}
```

---

## User Roles

The system has three user roles:

- **`user`** - regular user (default)
- **`manager`** - manager (access to order management)
- **`admin`** - administrator (full access)

Role is stored in the `users` table in the `role` column and is retrieved from the database during authentication initialization.

### Role Constants

**File:** `src/constants/roles.js`

```javascript
export const ROLES = {
  USER: "user",
  MANAGER: "manager",
  ADMIN: "admin",
};

export const ROLE_PERMISSIONS = {
  ORDERS_MANAGEMENT: [ROLES.ADMIN, ROLES.MANAGER],
  STATISTICS: [ROLES.ADMIN],
  PRODUCTS_MANAGEMENT: [ROLES.ADMIN],
  ADD_PRODUCT: [ROLES.ADMIN],
};
```

## Protected Endpoints

### Endpoints with Authentication (any role)

#### Cart API

- `GET /api/cart` - get cart
- `POST /api/cart` - add to cart
- `PATCH /api/cart/:productId` - update cart
- `DELETE /api/cart/:productId` - remove from cart
- `DELETE /api/cart` - clear cart
- `POST /api/cart/merge` - merge carts

#### Orders API

- `POST /api/orders` - create order

#### Users API

- `GET /api/users/me` - get current user

### Endpoints with Role Check

#### Orders Management (admin, manager)

- `GET /api/orders/all` - get all orders
- `PUT /api/orders/:orderId/status` - update order status

#### Statistics (admin only)

- `GET /api/stats/popular-products` - get popular products

#### Products Management (admin only)

- `GET /api/products/admin/all` - get all products (including inactive)
- `GET /api/products/admin/:productId` - get product for editing
- `POST /api/products` - create product
- `PUT /api/products/:productId` - update product
- `PUT /api/products/:productId/active` - change product active status

---

## Guest Users

### Guest Cart

Unauthenticated users can use the cart via **localStorage**:

**Storage:**

```javascript
localStorage.setItem("guestCart", JSON.stringify(cartItems));
```

**Merging:**
On registration/login, the guest cart is automatically merged with the user's cart via the `POST /api/cart/merge` endpoint.

---

## Creating User in DB

On registration, a record is created in the `users` table:

**API:** `POST /api/users`

**Parameters:**

```json
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Backend checks:**

- Whether a user with such `firebase_uid` exists
- If exists - updates data
- If not exists - creates a new record with `role = 'user'` by default

**`users` Table Structure:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'manager', 'admin'))
);
```

---

## Updating User Profile

Profile is updated automatically when placing an order:

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

## Error Handling

### Frontend:

- Firebase errors are displayed to the user
- `auth/email-already-in-use` - email already in use
- `auth/invalid-email` - invalid email format
- `auth/weak-password` - weak password

### Backend:

- `401 Unauthorized` - no token or token is invalid
- `404 User not found` - user not found in DB (for some endpoints an empty array is returned)

---

## Frontend Route Protection

### ProtectedRoute Component

**File:** `src/components/common/ProtectedRoute.jsx`

Component for protecting routes based on user role:

```javascript
<ProtectedRoute allowedRoles={["admin", "manager"]}>
  <AdminOrderList />
</ProtectedRoute>
```

**Logic:**

1. Checks authentication initialization
2. Checks for user presence (redirects to `/login` if not)
3. Checks user role (redirects to `/account` if insufficient permissions)

### Admin Menu Configuration

**File:** `src/constants/adminMenu.js`

Defines available menu items for each role:

```javascript
export const ADMIN_MENU_ITEMS = [
  {
    title: "Orders Management",
    link: "/admin/orders",
    allowedRoles: ["admin", "manager"],
  },
  {
    title: "Statistics",
    link: "/admin/stats",
    allowedRoles: ["admin"],
  },
  // ...
];
```

**Important:** Frontend configuration is used only for UX (hiding/showing elements). Real protection happens on the backend through middleware.

## Security

1. **JWT tokens** - temporary tokens with expiration
2. **Token verification** - each protected request verifies the token through Firebase Admin SDK
3. **Backend role checking** - middleware `requireRole` checks user role from DB on every request
4. **Frontend route protection** - `ProtectedRoute` component prevents access to pages without required permissions
5. **HTTPS** - recommended for production
6. **CORS** - CORS configuration to protect against unauthorized sources

**Important:** Changing role configuration on the frontend will not grant API access - the backend always checks the role on every request.

---

## Environment Variables

### Frontend:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Backend:

Firebase service account file or environment variables for Firebase Admin SDK are required.

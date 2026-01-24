# TINT Project Architecture

## General Structure

The project uses a **full-stack** application architecture with separation between frontend and backend.

```
korean-cosmetics-TINT/
├── backend/          # Node.js + Express server
├── src/              # React frontend application
├── public/           # Static files
└── docs/             # Documentation
```

## Frontend Architecture

### Technology Stack

- **React 18** - UI library
- **Vite** - build tool and dev server
- **Redux Toolkit** - global state management
- **React Router v6** - routing
- **Tailwind CSS** - styling

### Architectural Approach: Feature-Sliced Design

The project follows **Feature-Sliced Design (FSD)** principles for code organization:

```
src/
├── features/              # Isolated features
│   ├── cart/             # Cart logic
│   │   ├── lib/          # Utilities (localStorage, reducers)
│   │   ├── selectors/    # Redux selectors
│   │   └── cartAuth.js   # Authorization for cart
│   └── products/         # Products logic
├── components/           # Reusable components
│   ├── common/           # Common components
│   ├── layout/           # Layout components
│   ├── pages/            # Page components
│   └── ui/               # UI components
├── pages/                # Application pages
├── hooks/                # Custom React hooks
│   ├── useAdminOrder.js   # Hook for order management (admin)
│   ├── useAdminProducts.js # Hook for product management (admin)
│   ├── useAdminStats.js   # Hook for statistics (admin)
│   └── ...                # Other hooks
├── store/                # Redux store
│   └── slices/           # Redux slices
├── api/                  # API clients
├── utils/                # Utilities
├── constants/            # Constants
│   ├── roles.js          # Role constants and permissions
│   ├── adminMenu.js      # Admin menu configuration
│   └── ...               # Other constants
└── config/               # Configuration
```

### State Management

#### Redux Store Structure:

```javascript
{
  auth: {
    user: { uid, email, displayName, role } | null,
    initialized: boolean
  },
  products: {
    products: { entities: {}, ids: [] },  // Normalized data
    productPage: { id, status, error },
    lists: {
      newProducts: { ids: [], page, limit, hasMore, status },
      onSaleProducts: { ids: [], page, limit, hasMore, status },
      productsByCategory: { ids: [], page, limit, hasMore, status },
      // ... other lists
    },
    brands: { data: [], status, error },
    categories: { data: [], status, error }
  },
  cart: {
    items: [],
    selected: {},
    source: "guest" | "user"
  }
}
```

#### Features:

- **createEntityAdapter** - for product data normalization
- **createSelector** - for selector memoization
- **createAsyncThunk** - for async operations

### Routing

The application uses **React Router v6** with hierarchical route structure:

```
/                           # Home page
├── /categories            # Category list
├── /categories/:category  # Products by category
├── /brands                # Brand list
├── /brands/:brand         # Products by brand
├── /new-in                # New products
├── /promotions            # Products on sale
├── /bestsellers           # Bestsellers
├── /product/:slug         # Product page
├── /cart                  # Cart
├── /order/new             # Order placement
├── /order/confirmation/:id # Confirmed order page
├── /blog                  # Blog
├── /blog/:postName        # Blog post
├── /login                 # Login
├── /signup                # Registration
├── /account               # Account
├── /admin                 # Admin panel (requires authentication)
│   ├── /admin/orders      # Order management (admin, manager)
│   ├── /admin/stats       # Statistics (admin only)
│   ├── /admin/products    # Product management (admin only)
│   └── /admin/products/add # Add product (admin only)
```

### Component Structure

#### Layout Components:

- `HeroLayout` - layout with hero section (home, categories, brands)
- `StandardLayout` - standard layout (product page, account)
- `HomepageLayout` - home page layout

#### UI Components:

- **Cards**: `ProductCard`, `BlogCard`
- **Sliders**: `Slider`, `NewProductsSlider`, `PromotionsSlider`, `BestsellersSlider`
- **Modals**: `SearchModal`, `ImageFullSizeModal`, `ConfirmModal`
- **Forms**: `LoginForm`, `SignUpForm`, `InputField`
- **Skeletons**: Loading states for improved UX

#### Admin Components:

- **Tables**: `AdminOrdersTable`, `AdminProductsTable`, `AdminStatsTable`
- **Common**: `AdminMenuItem`, `AdminQuickActions`
- **ProtectedRoute**: Component for role-based route protection

#### Component Separation Pattern:

Admin pages follow the pattern of separating logic and presentation:

```
AdminPage.jsx (page)
  ├── useAdminHook.js (data fetching logic)
  └── AdminTable.jsx (table component)
```

**Examples:**

- `AdminOrderList` → `useAdminOrder` + `AdminOrdersTable`
- `AdminProducts` → `useAdminProducts` + `AdminProductsTable`
- `AdminStats` → `useAdminStats` + `AdminStatsTable`

### Performance Optimization

1. **Code Splitting**:

   - React.lazy() for dynamic imports
   - Lazy loading images via Intersection Observer

2. **Memoization**:

   - `useMemo` for computed values
   - `useCallback` for functions
   - `createSelector` for Redux selectors

3. **Lazy Loading**:

   - Images with `loading="lazy"` attribute
   - Intersection Observer for content loading
   - Infinite scroll for pagination

4. **Data Normalization**:
   - `createEntityAdapter` to avoid data duplication
   - Centralized product storage

## Backend Architecture

### Pattern: MVC + Repository

```
backend/
├── controllers/      # HTTP request handling
├── services/         # Business logic
├── repositories/     # Database operations
├── routes/           # API routes
├── middleware/       # Middleware (auth, error handling)
└── db.js            # Database connection
```

### Architecture Layers:

#### 1. Routes

Define API endpoints and bind them to controllers.

#### 2. Controllers

- Receive HTTP requests
- Validate input data
- Call services
- Form HTTP responses

#### 3. Services

- Contain business logic
- Call repositories for database operations
- Handle transactions
- Perform business rule validation

#### 4. Repositories

- Encapsulate database work
- Execute SQL queries
- Return clean data

### Middleware

#### Authentication:

```javascript
authenticateToken(req, res, next);
```

- Checks JWT token from `Authorization` header
- Verifies token through Firebase Admin SDK
- Adds user data to `req.user`

#### Role Checking:

```javascript
requireRole(["admin", "manager"])(req, res, next);
```

- Checks user role from database
- Compares with allowed roles
- Returns `403 Forbidden` if role doesn't match
- Adds user data from DB to `req.userData`

**Usage:**

```javascript
router.get("/admin/all", 
  authenticateToken,           // First check token
  requireRole(["admin"]),      // Then check role
  getAllAdminProducts
);
```

### Error Handling

All errors are handled in controllers:

```javascript
try {
  // business logic
} catch (err) {
  res.status(err.status || 500).json({ error: err.message });
}
```

## Data Flows

### Getting Products:

```
Frontend (Products.jsx)
  ↓ dispatch(fetchProductsByCategory(...))
Redux Thunk (productsSlice.js)
  ↓ API call
Backend API (/api/products/categories/:category)
  ↓ Controller
Service (products.service.js)
  ↓ Repository call
Repository (products.repository.js)
  ↓ SQL Query
PostgreSQL Database
  ↓ Response
Frontend (normalize → store → render)
```

### Order Placement:

```
Frontend (CreateOrder.jsx)
  ↓ dispatch(createOrder(...))
Backend API (/api/orders)
  ↓ Controller (authenticateToken)
Service (order.service.js)
  ↓ BEGIN TRANSACTION
  ↓ Repository operations
  ↓ UPDATE stock
  ↓ COMMIT
Frontend (redirect to confirmation)
```

## Integrations

### Firebase

- **Frontend**: User authentication
- **Backend**: JWT token verification

### PostgreSQL

- Main database
- Storage for products, orders, users, cart

## Security

1. **JWT tokens** for API request authentication
2. **Role checking** - middleware `requireRole` checks user role from DB on every request
3. **Frontend route protection** - `ProtectedRoute` component prevents access to pages without required permissions
4. **CORS** settings to protect against unauthorized requests
5. **Parameterized SQL queries** to prevent SQL injection
6. **Data validation** at controller and service levels
7. **Transactions** for data integrity

**Important:** Real protection happens on the backend. Frontend is used only for UX (hiding/showing interface elements).

## Scalability

### Frontend:

- Code splitting to reduce initial bundle size
- Pagination for large product lists
- Lazy loading for loading optimization

### Backend:

- Connection pooling for PostgreSQL
- Asynchronous request handling
- Transactions for critical operations

## Testing

- ESLint for code checking
- TypeScript types (optional via @types packages)

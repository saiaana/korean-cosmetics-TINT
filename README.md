# TINT - Korean Cosmetics E-commerce Platform

A modern Korean cosmetics e-commerce platform with full e-commerce functionality.

## 📋 Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API](#api)
- [Development](#development)

## 📖 Description

TINT is a full-featured Korean cosmetics e-commerce platform. The project includes a React frontend and a Node.js backend with Express.

### Key Features:

- 🛍️ Product catalog with filtering by categories and brands
- 🔍 Product search
- 🛒 Shopping cart (for authenticated and guest users)
- 👤 Authentication and authorization system with roles (user, manager, admin)
- 📦 Order placement
- 📝 Blog about Korean cosmetics
- 🛡️ Admin panel with role-based access control
- 📊 Sales statistics for administrators
- 🎛️ Product and order management
- 📱 Responsive design
- ⚡ Performance optimization (lazy loading, pagination)

## 🛠 Technologies

### Frontend:
- **React 18** - UI library
- **Vite** - build tool and dev server
- **Redux Toolkit** - state management
- **React Router** - routing
- **Tailwind CSS** - styling
- **Swiper** - sliders
- **Firebase** - authentication

### Backend:
- **Node.js** - server platform
- **Express 5** - web framework
- **PostgreSQL** - database
- **Firebase Admin SDK** - server-side authentication

### Development Tools:
- **ESLint** - code linter
- **Prettier** - code formatter
- **Nodemon** - server auto-reload
- **Concurrently** - parallel frontend and backend execution

## ✨ Features

### For Users:
- Browse product catalog
- Filter by categories and brands
- Search products
- View detailed product information
- Add products to cart
- Manage cart items quantity, clear cart
- Registration and authentication
- Place orders
- View order history
- Read cosmetics blog

### For Administrators and Managers:
- 📊 **Statistics** (admin only) - view popular products for the last 12 months
- 📦 **Order Management** (admin, manager) - view and update order statuses
- 🛒 **Product Management** (admin only) - add, edit, and deactivate products
- 🔐 **Access Control** - role-based system with permission checks on backend and frontend

## 🚀 Installation

### Requirements:
- Node.js (version 20 or higher)
- PostgreSQL
- npm or yarn

### Installation Steps:

1. **Clone the repository:**
```bash
git clone https://github.com/saiaana/korean-cosmetics-TINT
cd korean-cosmetics-TINT
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up the database:**
   - Create a PostgreSQL database
   - Run migrations (if any)

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root and a `backend/.env` file for the backend.

#### Frontend (.env in root):
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_API_BASE_URL=http://localhost:4000
```

#### Backend (backend/.env):
```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_postgres_user
PG_PASSWORD=your_postgres_password
PG_DATABASE=your_database_name

```

### Firebase Admin SDK

Place the Firebase service account file in `backend/config/` or configure environment variables.

## 🏃 Running the Project

### Development Mode:

Run frontend and backend simultaneously:
```bash
npm run dev
```

Or separately:
```bash
# Frontend (port 5174)
npm run dev-frontend

# Backend (port 4000)
npm run dev-backend
```

### Production Build:

1. **Build frontend:**
```bash
npm run build
```

2. **Run backend:**
```bash
npm run dev-backend
# or use PM2 for production
```

### Database Migrations:
```bash
npm run migrate
```

## Scripts

- upload-to-cloudinary.js — bulk image upload
- update-catalog-images.js — update catalog_images.url
- update-variant-images.js — update variant_images.url

## 📁 Project Structure

```
korean-cosmetics-TINT/
├── backend/                 # Backend application
│   ├── config/             # Configuration files
│   ├── constants/           # Constants
│   ├── controllers/         # Controllers (request handling)
│   ├── middleware/          # Middleware (authentication, role checking)
│   ├── repositories/        # Repositories (database operations)
│   ├── routes/              # API routes
│   ├── scripts/             # Scripts (migrations, synchronization)
│   ├── services/            # Business logic
│   ├── db.js               # Database connection
│   ├── firebaseAdmin.js    # Firebase Admin initialization
│   └── index.js            # Server entry point
│
├── src/                     # Frontend application
│   ├── api/                 # API clients
│   ├── assets/              # Static resources
│   ├── auth/                # Authentication logic
│   ├── components/          # React components
│   │   ├── common/          # Common components (ProtectedRoute, etc.)
│   │   ├── layout/         # Layout components
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin components (tables)
│   │   └── ui/             # UI components
│   ├── config/              # Configuration
│   ├── constants/           # Constants (roles, admin menu)
│   ├── data/                # Static data
│   ├── features/            # Feature modules (FSD)
│   ├── hooks/               # Custom hooks (useAdminOrder, useAdminProducts, useAdminStats)
│   ├── pages/               # Application pages
│   ├── store/               # Redux store
│   ├── utils/               # Utilities
│   ├── App.jsx              # Main component
│   └── main.jsx             # Entry point
│
├── public/                   # Public files
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind configuration
```

## 🔌 API

### Main Endpoints:

#### Products:
- `GET /api/products/categoriesList` - List categories
- `GET /api/products/categories/:category` - Products by category
- `GET /api/products/brands` - List brands
- `GET /api/products/brands/:brand` - Products by brand
- `GET /api/products/new` - New products
- `GET /api/products/on-sale` - Products on sale
- `GET /api/products/bestsellers` - Bestsellers
- `GET /api/products/slug/:slug` - Product by slug
- `GET /api/products/search` - Search products

#### Cart:
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/merge` - Merge guest cart with user cart

#### Orders:
- `POST /api/orders` - Create order (requires authentication)
- `GET /api/orders/user/:firebaseUid` - User orders
- `GET /api/orders/:orderId` - Order details

#### Admin API (requires special roles):
- `GET /api/orders/all` - All orders (admin, manager)
- `PUT /api/orders/:orderId/status` - Update order status (admin, manager)
- `GET /api/stats/popular-products` - Popular products (admin only)
- `GET /api/products/admin/all` - All products for admin (admin only)
- `GET /api/products/admin/:productId` - Product for editing (admin only)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:productId` - Update product (admin only)
- `PUT /api/products/:productId/active` - Change active status (admin only)

#### Users:
- `POST /api/users` - Create user
- `GET /api/users/me` - Current user (requires authentication, returns role)

## 💻 Development

### Architecture:

The project uses **Feature-Sliced Design** approach for code organization:
- `features/` - isolated features (cart, products)
- `components/` - reusable components
- `pages/` - application pages
- `hooks/` - custom hooks (including admin hooks: `useAdminOrder`, `useAdminProducts`, `useAdminStats`)
- `utils/` - utilities
- `constants/` - constants (roles, admin menu)

**Component Separation Pattern:**
Admin pages follow the pattern of separating logic and presentation:
- `AdminPage.jsx` (page) → `useAdminHook.js` (logic) + `AdminTable.jsx` (presentation)

### State Management:

- **Redux Toolkit** for global state
- **createEntityAdapter** for data normalization
- **createSelector** for selector memoization

### Styling:

- **Tailwind CSS** for styles
- Components use grouped styles in objects for easier maintenance
- Responsive design with breakpoints: sm, md, lg, xl

### Optimization:

- **Lazy loading** images via Intersection Observer
- **Infinite scroll** for product pagination
- **Code splitting** via React.lazy()
- **Skeleton screens** for improved UX
- **Memoization** of components and selectors

### Linting and Formatting:

```bash
# Code check
npm run lint

# Formatting
npm run format
npm run format:check
```

## 📝 Scripts

- `npm run dev` - Run frontend and backend in development mode
- `npm run dev-frontend` - Run frontend only
- `npm run dev-backend` - Run backend only
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without changes
- `npm run migrate` - Run database migrations

## 🔒 Security

- **Authentication** via Firebase
- **JWT tokens** for API requests
- **Role-based system** (user, manager, admin) with permission checks
- **Role checking middleware** on backend for all admin endpoints
- **Route protection** on frontend via `ProtectedRoute` component
- **CORS settings** for API protection
- **Input validation** at controller and service levels
- **SQL injection protection** via parameterized queries
- **Transactions** for data integrity

### Roles and Permissions:

- **user** (default) - regular user, can place orders
- **manager** - can manage orders (view, update statuses)
- **admin** - full access: manage products, orders, view statistics

**Important:** Real protection happens on the backend. Frontend is used only for UX (hiding/showing interface elements).

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- **[auth.md](docs/auth.md)** - Authentication, authorization and role system
- **[api.md](docs/api.md)** - Complete API endpoints documentation
- **[architecture.md](docs/architecture.md)** - Project architecture
- **[database.md](docs/database.md)** - Database structure

## 👥 Author

Pet project - TINT Korean Cosmetics Shop

---

**Note:** To run the project, you need to configure all environment variables and database according to the [Configuration](#configuration) section. To access the admin panel, you need to create a user with `admin` or `manager` role in the database.

## 🌐 Other Languages

- [Русский (Russian)](README.ru.md)
- [한국어 (Korean)](README.kr.md)

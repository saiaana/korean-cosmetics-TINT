import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeroLayout from "./components/layout/HeroLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import BrandsList from "./pages/BrandsList";
import Cart from "./pages/Cart";
import CreateOrder from "./pages/CreateOrder";
import CategoriesList from "./pages/CategoriesList";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import AdminOrderList from "./pages/AdminOrderList";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import StandardLayout from "./components/layout/StandardLayout";
import HomepageLayout from "./components/layout/HomepageLayout";
import AdminOrderInfo from "./pages/AdminOrderInfo";
import Admin from "./pages/Admin";
import AdminStats from "./pages/AdminStats";
import AddProduct from "./pages/AddProduct";
import AdminProducts from "./pages/AdminProducts";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ROLE_PERMISSIONS } from "./constants/roles";

const router = createBrowserRouter([
  {
    element: <HeroLayout />,
    children: [
      {
        path: "/blog",
        element: <BlogList />,
        handle: {
          label: "BLOG",
        },
      },
      {
        path: "/blog/:blogPostName",
        element: <BlogPost />,
        handle: {
          label: "BLOG",
        },
      },
      {
        path: "/cart",
        element: <Cart />,
        handle: {
          label: "CART",
        },
      },
      {
        path: "/new-in",
        element: <Products />,
        handle: {
          label: "NEW IN",
        },
      },
      {
        path: "/promotions",
        element: <Products />,
        handle: {
          label: "PROMOTIONS",
        },
      },

      {
        path: "/bestsellers",
        element: <Products />,
        handle: {
          label: "BESTSELLERS",
        },
      },

      {
        path: "/categories",
        element: <CategoriesList />,
        handle: {
          label: "CATEGORIES",
        },
      },
      {
        path: "/categories/:productsCategory",
        element: <Products />,
        handle: {
          label: (params) => params.productsCategory.toUpperCase(),
        },
      },

      {
        path: "/brands",
        element: <BrandsList />,
        handle: {
          label: "BRANDS",
        },
      },
      {
        path: "/brands/:brand",
        element: <Products />,
        handle: {
          label: (params) => params.brand.toUpperCase(),
        },
      },
    ],
  },
  {
    element: <StandardLayout />,
    children: [
      {
        path: "/product/:slug",
        element: <Product />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.ORDERS_MANAGEMENT}>
            <AdminOrderList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders/:orderId",
        element: (
          <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.ORDERS_MANAGEMENT}>
            <AdminOrderInfo />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/stats",
        element: (
          <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.STATISTICS}>
            <AdminStats />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products",
        element: (
          <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.PRODUCTS_MANAGEMENT}>
            <AdminProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/add",
        element: (
          <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.ADD_PRODUCT}>
            <AddProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/:productId/edit",
        element: (
          <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.PRODUCTS_MANAGEMENT}>
            <AddProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order/confirmation/:orderId",
        element: <OrderConfirmation />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    element: <HomepageLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    element: <StandardLayout />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

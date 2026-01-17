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
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import StandardLayout from "./components/layout/StandardLayout";
import HomepageLayout from "./components/layout/HomepageLayout";

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

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ROUTES from "../constants/routes";
import Loading from "./Loading";
import AdminMenuItem from "../components/pages/admin/AdminMenuItem";
import AdminQuickActions from "../components/pages/admin/AdminQuickActions";

export default function Admin() {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);

  if (!isAuthInitialized) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  const adminMenuItems = [
    {
      title: "Orders Management",
      description: "View and manage all customer orders",
      link: "/admin/orders",
      icon: "📦",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      title: "Statistics",
      description: "View sales and performance analytics",
      link: "/admin/stats",
      icon: "📊",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      title: "Add Product",
      description: "Create a new product in the catalog",
      link: "/admin/products/add",
      icon: "➕",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold text-stone-800">
          Admin Panel
        </h1>
        <p className="text-stone-600">
          Manage your store, orders, and analytics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminMenuItems.map((item) => (
            <AdminMenuItem key={item.link} title={item.title} icon={item.icon} link={item.link} color={item.color} description={item.description} />
        ))}
      </div>
      <AdminQuickActions />
    </div>
  );
}
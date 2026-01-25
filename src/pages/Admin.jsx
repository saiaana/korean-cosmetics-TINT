import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ROUTES from "../constants/routes";
import Loading from "./Loading";
import AdminMenuItem from "../components/pages/admin/AdminMenuItem";
import AdminQuickActions from "../components/pages/admin/AdminQuickActions";
import { getAdminMenuItemsForRole } from "../constants/adminMenu";
import useLogout from "../hooks/useLogout";
import ConfirmModal from "../components/ui/modals/ConfirmModal";

export default function Admin() {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);

  const {
    isConfirmOpen,
    requestLogout,
    cancelLogout,
    confirmLogout,
    isLoading,
  } = useLogout();

  if (!isAuthInitialized) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  const userRole = user?.role || "user";
  const adminMenuItems = getAdminMenuItemsForRole(userRole);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold text-stone-800">
            Admin Panel
          </h1>

          <p className="text-stone-600">
            Manage your store, orders, and analytics
          </p>
        </div>

        <button
          onClick={requestLogout}
          disabled={isLoading}
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
        >
          Log out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminMenuItems.map((item) => (
          <AdminMenuItem
            key={item.link}
            title={item.title}
            icon={item.icon}
            link={item.link}
            color={item.color}
            description={item.description}
          />
        ))}
      </div>
      <AdminQuickActions />

      <ConfirmModal
        open={isConfirmOpen}
        title="Log out"
        description="Are you sure you want to log out?"
        cancelButtonText="Cancel"
        confirmButtonText="Log out"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}

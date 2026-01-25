import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ROUTES from "../constants/routes";
import Loading from "./Loading";
import { useAdminStats } from "../hooks/useAdminStats";
import AdminStatsTable from "../components/pages/admin/AdminStatsTable";
import AdminPageReturnButton from "../components/pages/admin/AdminPageReturnButton";

function AdminStats() {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);
  const { popularProducts, loading, error } = useAdminStats(user, 20);

  if (!isAuthInitialized) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
<AdminPageReturnButton />
        <h1 className="mb-2 text-3xl font-extrabold text-stone-800">
          Statistics
        </h1>
        <p className="text-stone-600">
          Popular products from the last 12 months
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-stone-600">Loading statistics...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>Error: {error}</p>
        </div>
      ) : popularProducts.length === 0 ? (
        <div className="rounded-lg bg-stone-50 p-8 text-center">
          <p className="text-stone-600">No data available.</p>
        </div>
      ) : (
        <AdminStatsTable popularProducts={popularProducts} />
      )}
    </div>
  );
}

export default AdminStats;

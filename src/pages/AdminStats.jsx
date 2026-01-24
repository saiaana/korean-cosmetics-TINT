import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ROUTES from "../constants/routes";
import Loading from "./Loading";
import { useAdminStats } from "../hooks/useAdminStats";
import AdminStatsTable from "../components/pages/admin/AdminStatsTable";

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
        <Link
          to="/admin"
          className="mb-4 inline-flex items-center text-sm text-stone-600 hover:text-stone-800"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Admin Panel
        </Link>
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

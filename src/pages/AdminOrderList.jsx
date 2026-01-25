import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ROUTES from "../constants/routes";
import Loading from "./Loading";
import { useAdminOrder } from "../hooks/useAdminOrder";
import AdminOrdersTable from "../components/pages/admin/AdminOrdersTable";
import AdminPageReturnButton from "../components/pages/admin/AdminPageReturnButton";

function AdminOrderList() {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);
  const { orders, loading, error, updatingStatus, page, hasMore, total, handleStatusChange, setPage } = useAdminOrder(user);
 

  if (!isAuthInitialized) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
<AdminPageReturnButton />
      <h1 className="mb-8 text-3xl font-extrabold text-stone-800">
        Admin Panel - Orders Management
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-stone-600">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>Error: {error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg bg-stone-50 p-8 text-center">
          <p className="text-stone-600">No orders found.</p>
        </div>
      ) : (
        <AdminOrdersTable orders={orders} updatingStatus={updatingStatus} handleStatusChange={handleStatusChange} />
      )}

      {!loading && orders.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-stone-600">
            Showing {orders.length} of {total} orders
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4 py-2 text-sm text-stone-700">
              Page {page}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasMore}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrderList;

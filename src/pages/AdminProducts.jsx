
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAdminProducts } from "../hooks/useAdminProducts";
import AdminProductsTable from "../components/pages/admin/AdminProductsTable";

export default function AdminProducts() {
  const user = useSelector((state) => state.auth.user);
 const navigate = useNavigate();
 const navigateToEdit = (productId) => {
  navigate(`/admin/products/${productId}/edit`);
 };

  const { allProducts, loading, error, toggleActive, updatingIds } = useAdminProducts(user);


  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-extrabold text-stone-800">
        Admin Panel - Products Management
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-stone-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>Error: {error}</p>
        </div>
      ) : allProducts.length === 0 ? (
        <div className="rounded-lg bg-stone-50 p-8 text-center">
          <p className="text-stone-600">No products found.</p>
        </div>
      ) : (
        <AdminProductsTable allProducts={allProducts} updatingIds={updatingIds} onToggleActive={toggleActive} onEdit={navigateToEdit} />
      )}

      {!loading && allProducts.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-stone-600">
            Showing {allProducts.length} of {allProducts.length} products
          </div>
        </div>
      )}
    </div>
  );
}

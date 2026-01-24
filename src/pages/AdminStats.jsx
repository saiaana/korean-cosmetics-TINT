import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getPopularProducts } from "../api/statsApi";
import ROUTES from "../constants/routes";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/helpers";
import { getProductUrl } from "../utils/products/getProductUrl";
import ImageWithLoader from "../components/ui/ImageWithLoader";

function AdminStats() {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPopularProducts(20);
        setPopularProducts(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`;
  };

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
        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-stone-800">
              Top Popular Products (Last 12 Months)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-stone-700">
                      Quantity Sold
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-stone-700">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-stone-700">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {popularProducts.map((product, index) => {
                    const uniqueKey = product.variant_id
                      ? `${product.product_id}-${product.variant_id}`
                      : product.product_id;
                    const displayTitle = product.variant_title
                      ? `${product.title} - ${product.variant_title}`
                      : product.title;

                    return (
                      <tr key={uniqueKey} className="hover:bg-stone-50">
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold text-stone-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={getProductUrl(
                              product.product_id,
                              product.title,
                              product.variant_id || null
                            )}
                            className="flex items-center gap-4 hover:text-stone-900"
                          >
                            {product.image_url && (
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-stone-200">
                                <ImageWithLoader
                                  src={getImageUrl(product.image_url)}
                                  alt={displayTitle}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-stone-900">
                                {product.title}
                              </div>
                              {product.variant_title && (
                                <div className="text-xs text-stone-500">
                                  Variant: {product.variant_title}
                                </div>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                          {product.brand || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                          {product.product_category || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-stone-900">
                          {product.total_quantity}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-stone-700">
                          {product.order_count}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-green-700">
                          {formatPrice(product.total_revenue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-stone-600">
                Total Products Sold
              </div>
              <div className="mt-2 text-3xl font-bold text-stone-800">
                {popularProducts.reduce(
                  (sum, p) => sum + Number(p.total_quantity),
                  0
                )}
              </div>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-stone-600">
                Total Orders
              </div>
              <div className="mt-2 text-3xl font-bold text-stone-800">
                {popularProducts.reduce(
                  (sum, p) => sum + Number(p.order_count),
                  0
                )}
              </div>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-stone-600">
                Total Revenue
              </div>
              <div className="mt-2 text-3xl font-bold text-green-700">
                {formatPrice(
                  popularProducts.reduce(
                    (sum, p) => sum + Number(p.total_revenue),
                    0
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStats;

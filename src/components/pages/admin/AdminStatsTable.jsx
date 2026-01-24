import { Link } from "react-router-dom";
import { getProductUrl } from "../../../utils/products/getProductUrl";
import { getImageUrl } from "../../../utils/helpers";

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

export default function AdminStatsTable({ popularProducts }) {
  return (
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
                            <img
                              src={getImageUrl(product.image_url) || "/images/no-image.jpg"}
                              alt={product.title}
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
  );
}

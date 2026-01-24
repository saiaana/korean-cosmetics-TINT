import { getMainImageUrl } from "../../../utils/helpers";
import { getProductUrl } from "../../../utils/products/getProductUrl";
import { Link } from "react-router-dom";

export default function ProductsTable({ allProducts, updatingIds, onToggleActive, onEdit}) {

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
    <table className="w-full">
      <thead className="bg-stone-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Image
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Brand
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Price
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-stone-700">
            Status
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-stone-700">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-200 bg-white">
        {allProducts.map((product) => {
          const isUpdating = updatingIds.has(product.id);
          const src = getMainImageUrl(product.images);

          return (
            <tr key={product.id} className="hover:bg-stone-50">
              <td className="whitespace-nowrap px-6 py-4">
                {src && src !== "/images/no-image.jpg" ? (
                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-stone-200">
                    <img
                      src={src}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-stone-200 bg-stone-100">
                    <span className="text-xs text-stone-400">
                      No image
                    </span>
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                {product.id}
              </td>
              <td className="px-6 py-4 text-sm text-stone-900">
                <Link
                  className="cursor-pointer hover:text-stone-600"
                  to={getProductUrl(product.id, product.title)}
                >
                  {product.title}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                {product.brand || "N/A"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                {product.product_category || "N/A"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                ${product.price.toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-center">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    product.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(product.id)}
                    className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      onToggleActive(product.id, product.is_active)
                    }
                    disabled={isUpdating}
                    className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                      product.is_active
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {isUpdating
                      ? "Updating..."
                      : product.is_active
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  );
}
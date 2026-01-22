import { Link } from "react-router-dom";

export default function AdminQuickActions() {
    return (
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-stone-800">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/orders"
            className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
          >
            View All Orders
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            Back to Store
          </Link>
        </div>
      </div>
    )
}
import { formatDate } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";



const ORDER_STATUSES = [
    "created",
    "pending",
    "paid",
    "cancelled",
    "in progress",
    "out for delivery",
    "delivered",
  ];
  
  const STATUS_LABELS = {
    created: "Created",
    pending: "Pending",
    paid: "Paid",
    cancelled: "Cancelled",
    "in progress": "In Progress",
    "out for delivery": "Out for Delivery",
    delivered: "Delivered",
  };
  
  const STATUS_COLORS = {
    created: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    "in progress": "bg-purple-100 text-purple-800",
    "out for delivery": "bg-indigo-100 text-indigo-800",
    delivered: "bg-emerald-100 text-emerald-800",
  };

export default function AdminOrdersTable({ orders, updatingStatus, handleStatusChange }) {
    const navigate = useNavigate();
    const formatPrice = (price) => {
        return `$${Number(price).toFixed(2)}`;
      };
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
    <table className="w-full">
      <thead className="bg-stone-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Order ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Customer
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Total
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Address
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-700">
            Date
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-200 bg-white">
        {orders.map((order) => (
          <tr key={order.id} className="hover:bg-stone-50">
            <td
              className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900"
              onClick={() => navigate(`/admin/orders/${order.id}`)}
            >
              {order.id.slice(0, 8)}...
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
              {order.first_name} {order.last_name}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
              {order.email || "N/A"}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-stone-900">
              {formatPrice(order.total)}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm">
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value)
                }
                disabled={updatingStatus[order.id]}
                className={`rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                  STATUS_COLORS[order.status] ||
                  "bg-stone-100 text-stone-800"
                }`}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-6 py-4 text-sm text-stone-700">
              <div>
                {order.address && (
                  <div className="max-w-xs truncate">{order.address}</div>
                )}
                {order.city && (
                  <div className="text-xs text-stone-500">
                    {order.city}
                  </div>
                )}
              </div>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
              {formatDate(order.created_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}
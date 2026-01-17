import OrderCard from "./OrderCard";

function OrderList({ loading, error, orders }) {
  if (loading) {
    return <p className="text-sm text-stone-500">Loading your orders…</p>;
  }

  if (error) {
    return <p className="text-sm text-pink-600">Error: {error}</p>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-stone-800">My orders</h2>
        <p className="text-sm text-stone-600">You don’t have any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-stone-800">My orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default OrderList;

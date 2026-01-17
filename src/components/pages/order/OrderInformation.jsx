function OrderInformation({ order }) {
  const total = order.total;

  const info = [
    {
      label: "Order ID",
      value: order.id,
    },
    {
      label: "Customer",
      value: order.customer.firstName + " " + order.customer.lastName,
    },
    {
      label: "Address",
      value: order.customer.address + " / " + order.customer.city,
    },
    {
      label: "Status",
      value: order.status,
      className:
        order.status === "new"
          ? "inline-block rounded-full px-3 py-1 text-xs font-bold uppercase bg-green-100 text-green-700"
          : "inline-block rounded-full px-3 py-1 text-xs font-bold uppercase bg-yellow-100 text-yellow-700",
    },
    {
      label: "Total",
      value: "$" + Number(total).toFixed(2),
      className: "text-xl font-extrabold text-green-700",
    },
  ];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-extrabold text-green-700 md:text-3xl">
        Thank you for your order!
      </h1>

      <div className="grid gap-y-6 text-sm text-stone-700 sm:grid-cols-3">
        {info.map((item) => (
          <p key={item.label}>
            <span className={`font-semibold text-stone-500`}>{item.label}</span>
            <br />
            <span className={`${item.className}`}>{item.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default OrderInformation;

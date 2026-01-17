export default function OrderSummary({ itemsCount, totalPrice, isDisabled }) {
  return (
    <div className="sticky top-24 h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-stone-800">Order summary</h2>

      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <span className="text-sm text-stone-500">Items selected</span>
        <span className="text-sm font-semibold">{itemsCount}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-base font-medium text-stone-600">Total</span>
        <span className="text-2xl font-extrabold text-pink-600">
          ${totalPrice}
        </span>
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={`mt-6 h-12 w-full rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
          isDisabled
            ? "cursor-not-allowed bg-stone-200 text-stone-400"
            : "bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg"
        } `}
      >
        Place order
      </button>

      {isDisabled && (
        <p className="mt-3 text-center text-sm text-stone-500">
          Select at least one item to proceed
        </p>
      )}
    </div>
  );
}

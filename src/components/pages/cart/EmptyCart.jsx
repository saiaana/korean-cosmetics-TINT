function EmptyCart() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center pb-10 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6 h-20 w-20 text-pink-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8h11.2M7 13l.6-3M21 21H3"
        />
      </svg>
      <p className="text-xl font-medium text-green-600">Your cart is empty.</p>
      <p className="mt-2 text-xl text-gray-600">
        Looks like you haven&apos;t added anything to your cart yet.
      </p>
    </div>
  );
}

export default EmptyCart;


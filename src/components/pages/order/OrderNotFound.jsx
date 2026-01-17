function OrderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center pb-10 text-center">
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
          d="M10.29 3.86L1.82 18a1.5 1.5 0 001.28 2.25h17.8a1.5 1.5 0 001.28-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0zM12 9v4m0 4h.01"
        />
      </svg>

      <p className="text-xl font-medium text-green-600">
        Order with this ID does not exist
      </p>
      <p className="mt-2 text-xl text-gray-600">
        Check order your order ID or contact our manager
      </p>
    </div>
  );
}

export default OrderNotFound;

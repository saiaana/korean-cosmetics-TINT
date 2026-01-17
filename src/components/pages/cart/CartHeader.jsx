import { memo } from "react";

function CartHeader() {
  return (
    <div className="border-b border-stone-200 py-6">
      <h1 className="text-center text-3xl font-extrabold tracking-wide text-stone-800">
        Shopping Cart
      </h1>
    </div>
  );
}

export default memo(CartHeader);

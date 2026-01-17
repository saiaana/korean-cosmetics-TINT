export default function AddToCartButton({
  buttonText,
  existingCartQuantity,
  handleClick,
  disabled = false,
}) {
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold uppercase text-white transition active:scale-95 ${
        disabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-pink-600 hover:bg-pink-700"
      }`}
    >
      {buttonText}

      {existingCartQuantity > 0 && (
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-bold text-green-600 shadow">
          {Number(existingCartQuantity)}
        </span>
      )}
    </button>
  );
}

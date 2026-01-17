function ProductPriceBlock({ originalPrice, finalPrice, isOnSale }) {
  const displayPrice = finalPrice ?? originalPrice;

  return (
    <div className="flex flex-col text-2xl font-semibold sm:text-3xl md:text-4xl">
      {isOnSale ? (
        <div className="flex flex-col gap-1 sm:gap-2">
          <p className="font-bold text-pink-600">${displayPrice.toFixed(2)}</p>
          <p className="text-lg text-gray-600 line-through sm:text-xl md:text-2xl">
            ${originalPrice.toFixed(2)}
          </p>
        </div>
      ) : (
        <p className="mb-2 text-green-700">${originalPrice.toFixed(2)}</p>
      )}
    </div>
  );
}

export default ProductPriceBlock;

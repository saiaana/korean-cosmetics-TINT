import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductsGridSkeleton({ count = 12 }) {
  return (
    <div className="grid w-full grid-cols-2 gap-4 px-4 py-5 md:grid-cols-3 md:gap-6 md:px-8 lg:grid-cols-3 lg:gap-8 lg:px-10 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-stone-200 bg-white sm:aspect-[3/4]">
      <div className="flex h-full flex-col">
        <div className="relative min-h-0 flex-[3] overflow-hidden bg-stone-100">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex min-h-0 flex-col gap-2 overflow-hidden px-3 py-2 sm:px-4 sm:py-3 md:h-[30%]">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <div className="flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}


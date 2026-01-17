import Skeleton from "./Skeleton";

export default function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="sticky top-24 flex flex-col gap-6 self-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-6 w-20" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
      <div className="mt-16">
        <Skeleton className="mb-6 h-6 w-48" />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-48 flex-shrink-0 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}


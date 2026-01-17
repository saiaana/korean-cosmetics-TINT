import Skeleton from "./Skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function HomePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col justify-between overflow-x-hidden">
      <div className="relative h-[60vh] w-full bg-stone-100 md:h-[70vh]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="mt-8 px-5">
        <div className="flex flex-wrap gap-2 justify-center md:grid md:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="h-28 w-28 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-12">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-1 w-16 rounded-full" />
            </div>
            <div className="flex gap-4 overflow-x-auto px-4 pb-4 md:px-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[200px] flex-shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


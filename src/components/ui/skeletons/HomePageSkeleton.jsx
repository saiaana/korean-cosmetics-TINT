import Skeleton from "./Skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function HomePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col justify-between overflow-x-hidden">
      <div className="relative h-[320px] w-full bg-stone-100 sm:h-[400px] md:h-[480px] lg:h-[560px]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="mt-8 px-5">
        <div className="flex flex-wrap justify-center gap-2 md:grid md:grid-cols-4 lg:grid-cols-7">
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
          <section key={sectionIndex} className="w-full">
            <div className="mb-6 flex flex-col items-center gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-1 w-16 rounded-full" />
            </div>
            <div className="pb-10 pt-4 md:px-6">
              <div className="flex gap-3 overflow-x-auto px-0 min-[480px]:gap-3.5 min-[640px]:gap-4 min-[768px]:gap-[18px] min-[1024px]:gap-5 min-[1200px]:gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[calc((100%-12px)/2)] flex-shrink-0 min-[480px]:w-[calc((100%-14px)/2.2)] min-[640px]:w-[calc((100%-16px)/2.8)] min-[768px]:w-[calc((100%-18px)/3.2)] min-[1024px]:w-[calc((100%-20px)/4)] min-[1200px]:w-[calc((100%-24px)/4)]"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

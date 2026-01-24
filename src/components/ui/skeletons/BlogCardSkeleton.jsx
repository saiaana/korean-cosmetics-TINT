import Skeleton from "./Skeleton";

export default function BlogCardSkeleton() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md">
      <Skeleton className="h-full w-full" />
      <div className="absolute bottom-0 w-full bg-white/80 px-4 py-4 backdrop-blur-md">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

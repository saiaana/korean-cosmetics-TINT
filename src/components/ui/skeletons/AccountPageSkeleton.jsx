import Skeleton from "./Skeleton";

export default function AccountPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Skeleton className="mb-8 h-10 w-48" />
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2 pt-4 border-t border-stone-200">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <Skeleton className="mb-6 h-7 w-32" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex cursor-pointer justify-between rounded-lg border border-stone-200 bg-white p-4"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


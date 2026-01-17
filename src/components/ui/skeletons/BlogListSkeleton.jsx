import BlogCardSkeleton from "./BlogCardSkeleton";

export default function BlogListSkeleton({ count = 6 }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function ImageWithLoader({
  src,
  alt,
  className = "",
  onError,
  containerClassName = "",
  ...props
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src) {
      setLoading(true);
      setError(false);
    } else {
      setLoading(false);
      setError(false);
    }
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = (e) => {
    setLoading(false);
    setError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={`relative ${containerClassName || "h-full"}`}>
      {src && loading && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-100">
          <LoadingSpinner size="md" />
        </div>
      )}
      {src && error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-100">
          <div className="text-center text-stone-400">
            <svg
              className="mx-auto h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-1 text-xs">Failed to load</p>
          </div>
        </div>
      )}

      {!src && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-100">
          <p className="text-center text-stone-400">No image</p>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

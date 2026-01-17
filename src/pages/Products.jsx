import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import ProductCard from "../components/ui/cards/ProductCard";
import { useProductsPage } from "../hooks/useProductsPage";
import { useParams } from "react-router-dom";
import { ProductsGridSkeleton } from "../components/ui/skeletons";
import {
  fetchProductsByCategory,
  fetchProductsByBrand,
  fetchNewProducts,
  fetchOnSaleProducts,
  fetchBestsellerProducts,
} from "../store/slices/productsSlice";

function Products() {
  const { products, status, label, pagination } = useProductsPage();
  const { productsCategory, brand } = useParams();

  const dispatch = useDispatch();

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  const hasMore = pagination?.hasMore ?? false;
  const currentPage = pagination?.page ?? 1;

  // Helper function for determining the correct action to load more products
  const getLoadMoreAction = useCallback(() => {
    const nextPage = currentPage + 1;
    const limit = 12;

    switch (label) {
      case "byCategory":
        if (!productsCategory) return null;
        return fetchProductsByCategory({
          category: productsCategory,
          page: nextPage,
          limit,
          append: true,
        });
      case "byBrand":
        if (!brand) return null;
        return fetchProductsByBrand({
          brand,
          page: nextPage,
          limit,
          append: true,
        });
      case "new":
        return fetchNewProducts({ page: nextPage, limit, append: true });
      case "promotions":
        return fetchOnSaleProducts({ page: nextPage, limit, append: true });
      case "bestsellers":
        return fetchBestsellerProducts({ page: nextPage, limit, append: true });
      default:
        return null;
    }
  }, [label, productsCategory, brand, currentPage]);

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    const action = getLoadMoreAction();
    if (!action) return;

    setIsLoadingMore(true);
    try {
      await dispatch(action);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error loading more products:", err);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, getLoadMoreAction, dispatch]);

  const paginatedPages = useMemo(
    () => ["byCategory", "byBrand", "new", "promotions", "bestsellers"],
    [],
  );

  useEffect(() => {
    if (
      !paginatedPages.includes(label) ||
      !hasMore ||
      isLoadingMore ||
      status !== "succeeded"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, status, label, loadMoreProducts, paginatedPages]);

  if ((status === "loading" || status === "idle") && products.length === 0) {
    return <ProductsGridSkeleton />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-gray-500">No products found.</p>
      </div>
    );
  }


  return (
    <>
      <div className="grid w-full grid-cols-2 gap-4 px-4 py-5 md:grid-cols-3 md:gap-6 md:px-8 lg:grid-cols-3 lg:gap-8 lg:px-10 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
      {hasMore && (
        <div ref={observerTarget} className="h-10">
          {isLoadingMore && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-stone-500">Loading more products...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Products;

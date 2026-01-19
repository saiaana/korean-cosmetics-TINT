import { Link } from "react-router-dom";
import { getMainImageUrl } from "../../../utils/helpers";
import { getProductUrl } from "../../../utils/products/getProductUrl";
import useProductSearch from "../../../hooks/useProductSearch";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import ImageWithLoader from "../ImageWithLoader";

const styles = {
  backdrop: "fixed inset-0 z-50 flex items-start justify-center px-2 pt-4 sm:px-4 sm:pt-8 md:pt-20",
  overlay: "absolute inset-0 bg-black/60 backdrop-blur-sm",
  modal: "relative w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl sm:rounded-2xl",
  header: "border-b border-stone-200 p-3 sm:p-4",
  headerInner: "mb-2 flex items-center justify-between sm:mb-3",
  content: "max-h-[calc(100vh-180px)] overflow-y-auto p-3 sm:max-h-[50vh] sm:p-4",
  resultsList: "space-y-2",

  title: "text-base font-bold text-stone-800 sm:text-lg",
  statusText: "py-4 text-center text-sm text-stone-500 sm:py-6",
  errorText: "py-4 text-center text-sm text-pink-600 sm:py-6",

  closeButton:
    "flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 text-sm text-stone-600 transition-colors hover:bg-stone-100 active:bg-stone-200",

  searchContainer:
    "flex items-center gap-2 rounded-xl border border-stone-300 bg-stone-100 px-3 py-2 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 sm:gap-3",
  searchIcon: "text-base text-stone-500 sm:text-lg",
  searchInput: "w-full bg-transparent text-sm outline-none placeholder:text-stone-400",

  resultItem:
    "flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-2.5 transition-colors active:bg-stone-50 sm:gap-4 sm:rounded-xl sm:p-3 sm:hover:bg-stone-50",
  resultImage: "h-14 w-14 flex-shrink-0 rounded-lg object-cover sm:h-16 sm:w-16",
  resultContent: "min-w-0 flex-1",
  resultTitle: "line-clamp-2 text-sm font-semibold text-stone-800 sm:line-clamp-1",
  resultPrice: "mt-0.5 text-xs text-stone-500 sm:text-xs",
};

export default function SearchModal({ open, onClose }) {
  const { query, results, loading, error, updateQuery, resetSearch } =
    useProductSearch(open);


  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    resetSearch();
    onClose();
  };

  return createPortal(
    <div className={styles.backdrop}>
      <div className={styles.overlay} onClick={handleClose} />

      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <h2 className={styles.title}>Search products</h2>
            <button onClick={handleClose} className={styles.closeButton}>
              ✕
            </button>
          </div>

          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Search by product name…"
              autoFocus
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.content}>
          {loading && <p className={styles.statusText}>Searching…</p>}
          {error && <p className={styles.errorText}>{error}</p>}

          {!loading && !error && query.length >= 2 && results.length === 0 && (
            <p className={styles.statusText}>No products found</p>
          )}

          <ul className={styles.resultsList}>
            {results.map((item) => {
              const image = getMainImageUrl(item.images);

              return (
                <Link
                  key={item.id}
                  to={getProductUrl(item.id, item.title)}
                  onClick={handleClose}
                  className={styles.resultItem}
                >
                  <ImageWithLoader
                    src={image || "/images/no-image.jpg"}
                    alt={item.title}
                    className={styles.resultImage}
                    onError={(e) => {
                      if (e.target.src !== "/images/no-image.jpg") {
                        e.target.src = "/images/no-image.jpg";
                      }
                    }}
                  />
                  <div className={styles.resultContent}>
                    <p className={styles.resultTitle}>{item.title}</p>
                    <p className={styles.resultPrice}>
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}

import { Link } from "react-router-dom";
import { memo } from "react";
import useCartItem from "../../../hooks/useCartItem";
import { getProductUrl } from "../../../utils/products/getProductUrl";
import { getCartItemKey } from "../../../utils/cart/getCartItemKey";
import ImageWithLoader from "../../ui/ImageWithLoader";

const styles = {
  container: (isOutOfStock, isSelected) =>
    `group flex items-center gap-5 rounded-2xl border border-stone-200 bg-white p-4 transition-all duration-300 ${
      isOutOfStock
        ? "opacity-60"
        : "hover:shadow-md hover:ring-1 hover:ring-pink-400/40"
    } ${isSelected ? "ring-2 ring-pink-500/40" : ""}`,
  checkboxContainer: "flex items-center",
  checkbox: "h-4 w-4 accent-pink-600",
  image: "h-24 w-24 rounded-xl border object-cover",
  contentContainer: "flex flex-1 flex-col justify-between",
  priceContainer: "mt-1 flex items-center gap-2 text-sm",
  controlsContainer: "mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
  quantityContainer: "flex items-center gap-2",
  totalContainer: "flex flex-col items-end",

  productLink: "cursor-pointer text-sm font-bold uppercase tracking-wide text-stone-800 hover:text-pink-600",
  salePrice: "font-semibold text-pink-600",
  originalPrice: "text-stone-400 line-through",
  regularPrice: "font-semibold text-stone-800",
  outOfStockText: "mt-1 text-xs font-medium text-red-600",
  totalPrice: "text-sm font-semibold text-stone-900",
  exceededMaxText: "text-xs text-pink-600",

  quantityButton: (disabled) =>
    `flex h-7 w-7 items-center justify-center rounded-md border text-sm ${
      disabled ? "cursor-not-allowed opacity-50" : "hover:bg-stone-100"
    }`,
  quantityDisplay: "min-w-[20px] text-center text-sm font-medium",
  deleteButton: "text-stone-400 transition-colors hover:text-pink-600",
};

function CartItem({
  item,
  isSelected,
  handleDecrease,
  handleIncrease,
  handleDelete,
  handleSelectOne,
}) {
  const {
    mainImage,
    isOnSale,
    salePrice,
    originalPrice,
    displayTitle,
    displayTotal,
    isOutOfStock,
    exceededMaxAvailableQuantity,
  } = useCartItem({ item });

  const onDecrease = () => {
    if (isOutOfStock) return;
    handleDecrease(item.product_id, item.quantity, item.variant_id || null);
  };

  const onIncrease = () => {
    if (isOutOfStock) return;
    if (exceededMaxAvailableQuantity) return;
    handleIncrease(item.product_id, item.quantity, item.variant_id || null);
  };

  const productUrl = getProductUrl(
    item.product_id,
    item.baseTitle || item.title || item.name,
    item.variant_id || null,
  );

  const handleCheck = () => {
    const itemKey = getCartItemKey(item.product_id, item.variant_id);
    handleSelectOne(itemKey);
  };

  return (
    <div className={styles.container(isOutOfStock, isSelected)}>
      <label className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={isSelected}
          disabled={isOutOfStock}
          onChange={handleCheck}
          className={styles.checkbox}
        />
      </label>

      <ImageWithLoader
        src={mainImage || "/images/no-image.jpg"}
        alt={displayTitle}
        className={styles.image}
        onError={(e) => {
          if (e.target.src !== "/images/no-image.jpg") {
            e.target.src = "/images/no-image.jpg";
          }
        }}
      />

      <div className={styles.contentContainer}>
        <div>
          <Link className={styles.productLink} to={productUrl}>
            {displayTitle}
          </Link>

          <div className={styles.priceContainer}>
            {isOnSale ? (
              <>
                <span className={styles.salePrice}>${salePrice}</span>
                <span className={styles.originalPrice}>${originalPrice}</span>
              </>
            ) : (
              <span className={styles.regularPrice}>${originalPrice}</span>
            )}
          </div>
          {isOutOfStock && (
            <p className={styles.outOfStockText}>Out of stock</p>
          )}
        </div>

        {!isOutOfStock && (
          <div className={styles.controlsContainer}>
            <div className={styles.quantityContainer}>
              <button
                className={styles.quantityButton(false)}
                onClick={onDecrease}
              >
                −
              </button>

              <span className={styles.quantityDisplay}>{item.quantity}</span>

              <button
                className={styles.quantityButton(exceededMaxAvailableQuantity)}
                onClick={onIncrease}
                disabled={exceededMaxAvailableQuantity}
              >
                +
              </button>
            </div>

            <div className={styles.totalContainer}>
              <p className={styles.totalPrice}>${displayTotal}</p>
              {exceededMaxAvailableQuantity && (
                <p className={styles.exceededMaxText}>
                  Exceeded max available quantity
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => handleDelete(item.product_id, item.variant_id || null)}
        title="Remove"
        className={styles.deleteButton}
      >
        ✕
      </button>
    </div>
  );
}

export default memo(CartItem);

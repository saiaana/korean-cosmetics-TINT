import { Link } from "react-router-dom";
import { getMainImageUrl } from "../../../utils/helpers";
import { getProductUrl } from "../../../utils/products/getProductUrl";
import ImageWithLoader from "../ImageWithLoader";

const styles = {
  link: "block w-full",
  article:
    "group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:aspect-[3/4]",
  cardContainer: "flex h-full flex-col",
  imageContainer: "relative min-h-0 flex-[3] overflow-hidden",
  contentContainer:
    "flex min-h-0 flex-col overflow-hidden px-3 py-2 sm:px-4 sm:py-3 md:h-[30%]",

  image:
    "h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]",
  gradient:
    "absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent",
  badgesContainer: "absolute left-3 top-3 flex flex-col gap-2",

  markBadge:
    "rounded-full bg-pink-600 px-2.5 py-1 text-[10px] font-bold uppercase text-white",
  saleBadge:
    "rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white",

  textSize: "text-xs md:text-sm lg:text-base",
  brand:
    "text-xs font-semibold uppercase tracking-wide text-stone-500 md:text-sm lg:text-base",
  title:
    "mt-1 line-clamp-1 text-xs font-semibold leading-snug text-stone-900 md:text-sm lg:text-base",
  spacer: "flex-1",

  priceContainer: "flex items-baseline gap-2",
  finalPrice: "text-xs font-extrabold text-pink-600 md:text-sm lg:text-base",
  originalPrice:
    "text-xs font-semibold text-stone-400 line-through md:text-sm lg:text-base",
  regularPrice: "text-sm font-extrabold text-stone-900 md:text-sm lg:text-base",
};

function ProductCard({ mark, product }) {
  if (!product) return null;

  const mainImage = getMainImageUrl(product.images);
  const isOnSale = product.on_sale;
  const discountPercent = product.discount_percent;
  const finalPrice = product.finalPrice;
  const originalPrice = product.price?.toFixed(2) || "0.00";

  const productUrl = getProductUrl(product.id, product.title);

  return (
    <Link to={productUrl} className={styles.link}>
      <article tabIndex={0} className={styles.article}>
        <div className={styles.cardContainer}>
          <div className={styles.imageContainer}>
            <ImageWithLoader
              src={mainImage}
              alt={product.title}
              loading="lazy"
              className={styles.image}
            />

            <div className={styles.gradient} />

            <div className={styles.badgesContainer}>
              {mark && <span className={styles.markBadge}>{mark}</span>}

              {isOnSale && discountPercent && (
                <span className={styles.saleBadge}>-{discountPercent}%</span>
              )}
            </div>
          </div>

          <div className={styles.contentContainer}>
            <p className={styles.brand}>{product.brand}</p>

            <p className={styles.title}>{product.title}</p>

            <div className={styles.spacer} />

            {isOnSale ? (
              <div className={styles.priceContainer}>
                <p className={styles.finalPrice}>
                  ${finalPrice?.toFixed(2) || "0.00"}
                </p>
                <p className={styles.originalPrice}>${originalPrice}</p>
              </div>
            ) : (
              <p className={styles.regularPrice}>${originalPrice}</p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;

import { Link } from "react-router-dom";
import noImage from "../../../assets/images/no-image.jpg";
import ROUTES from "../../../constants/routes";
import CATEGORIES from "../../../constants/categories";
import ImageWithLoader from "../ImageWithLoader";

function ProductCategoryButton({ path, title }) {
  const imageSrc = CATEGORIES.find(
    (category) => category.name.toLowerCase() === path.toLowerCase(),
  )?.image;

  return (
    <Link
      to={ROUTES.category(title)}
      role="button"
      tabIndex={0}
      className="group flex w-[140px] cursor-pointer select-none flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1 focus:outline-none"
    >
      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:ring-2 group-hover:ring-pink-400/40 group-focus:ring-2 group-focus:ring-pink-400/50">
        <ImageWithLoader
          src={imageSrc || noImage}
          alt={title}
          loading="lazy"
          containerClassName="h-16 w-16"
          className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            if (e.target.src !== noImage) {
              e.target.src = noImage;
            }
          }}
        />
      </div>
      <p className="text-center text-sm font-semibold capitalize tracking-wide text-stone-800 transition-colors group-hover:text-pink-600">
        {title}
      </p>
    </Link>
  );
}

export default ProductCategoryButton;

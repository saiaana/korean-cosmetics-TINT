import { Link } from "react-router-dom";
import ROUTES from "../../../constants/routes";

export default function ProductHeader({ title, productCategory, brand }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs uppercase text-stone-500">
        <Link
          to={ROUTES.category(productCategory)}
          className="hover:text-pink-600"
        >
          {productCategory}
        </Link>
        <span>/</span>
        <Link to={ROUTES.brand(brand)} className="hover:text-pink-600">
          {brand}
        </Link>
      </div>

      <h1 className="text-2xl font-extrabold leading-tight text-stone-900 sm:text-3xl lg:text-4xl">
        {title}
      </h1>
    </div>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCategories,
  selectCategoriesStatus,
  fetchCategories,
} from "../../../store/slices/productsSlice";
import ROUTES from "../../../constants/routes";

function CatalogDropdown({ closeDropdown }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const categoriesStatus = useSelector(selectCategoriesStatus);

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  const categoryLabels = categories.map((category) =>
    typeof category === "string"
      ? category
      : category.name || category.title || category
  );
  return (
    <div
      className="animate-in fade-in slide-in-from-top-2 absolute left-1/3 top-full z-50 mt-4 w-[320px] -translate-x-1/2 rounded-2xl border border-stone-700 bg-stone-900/80 p-6 text-white shadow-2xl backdrop-blur-xl duration-200"
      onMouseLeave={closeDropdown}
    >
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
        Product categories
      </p>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
        {categoryLabels.map((label) => (
          <Link
            key={label}
            to={ROUTES.category(label)}
            className="group relative cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-stone-200 transition-colors duration-200 hover:bg-white/5 hover:text-pink-400"
          >
            <span className="relative inline-block">
              {label.replace("-", " ")}
            </span>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default CatalogDropdown;

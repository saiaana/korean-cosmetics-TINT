import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProductCategoryButton from "../ui/buttons/ProductCategoryButton";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesStatus,
} from "../../store/slices/productsSlice";

function ProductCategories() {
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCategoriesStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return (
      <div className="mt-15 flex justify-center text-sm text-gray-500">
        Loading categories…
      </div>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section className="mt-5 px-5">
      <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto px-2 py-4 md:grid md:grid-cols-4 md:justify-center md:overflow-visible md:px-0 lg:grid-cols-7">
        {categories.map((category) => {
          const categoryName =
            typeof category === "string"
              ? category
              : category.name || category.title;

          const categorySlug =
            typeof category === "string"
              ? category
              : category.slug || categoryName;

          return (
            <div
              key={categorySlug || category.id || categoryName}
              className="flex shrink-0 items-center justify-center"
            >
              <ProductCategoryButton path={categorySlug} title={categoryName} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProductCategories;

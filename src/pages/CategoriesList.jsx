import { useMemo } from "react";
import CategoryBrandList from "../components/common/CategoryBrandList";
import { useProductsPage } from "../hooks/useProductsPage";
import Loading from "./Loading";

function CategoriesList() {
  const { categories, status } = useProductsPage();

  const normalizedCategoriesList = useMemo(
    () =>
      categories?.map((category) =>
        typeof category === "string" ? category : category.title,
      ) || [],
    [categories],
  );

  if (status === "loading" || status === "idle") {
    return <Loading />;
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-gray-500">No categories found.</p>
      </div>
    );
  }


  return (
    <CategoryBrandList
      title="categories"
      listItems={normalizedCategoriesList}
      path="categories"
    />
  );
}

export default CategoriesList;

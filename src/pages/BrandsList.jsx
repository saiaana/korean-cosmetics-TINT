import { useMemo } from "react";
import CategoryBrandList from "../components/common/CategoryBrandList";
import Loading from "./Loading";
import { useProductsPage } from "../hooks/useProductsPage";

function BrandsList() {
  const { brands, status } = useProductsPage();

  const sortedBrands = useMemo(
    () =>
      brands
        ? [...brands].sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
          )
        : [],
    [brands]
  );

  if (status === "loading") {
    return <Loading />;
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-gray-500">No brands found.</p>
      </div>
    );
  }

  return (
    <CategoryBrandList title="brands" listItems={sortedBrands} path="brands" />
  );
}

export default BrandsList;

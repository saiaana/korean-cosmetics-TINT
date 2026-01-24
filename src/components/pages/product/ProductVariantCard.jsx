import useProductVariantCard from "../../../hooks/useProductVariantCard";
import { getStockStatus } from "../../../utils/products/getStockStatus";
import ImagesViewer from "./ImagesViewer";
import ProductStockStatusBadge from "./ProductStockStatusBadge";

export default function ProductVariantCard({
  onClick,
  variant,
  productPrice,
  selectedVariantId,
}) {
  const isSelected = Number(selectedVariantId) === Number(variant.id);

  const { variantImages, variantPrice, isAvailable } = useProductVariantCard(
    variant,
    productPrice
  );

  const stockStatus = getStockStatus(variant.variant_stock);

  return (
    <div
      onClick={onClick}
      className={`flex h-full cursor-pointer flex-col rounded-lg border-2 p-4 transition-all ${
        isSelected
          ? "border-pink-500 bg-pink-50"
          : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-md"
      } ${!isAvailable ? "opacity-60" : ""}`}
    >
      <div className="flex-shrink-0">
        <ImagesViewer images={variantImages} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <h4 className="font-semibold text-gray-800">{variant.variant_title}</h4>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-700">
            ${variantPrice.toFixed(2)}
          </span>
          <ProductStockStatusBadge
            stockStatus={stockStatus}
            stockQuantity={variant.variant_stock}
          />
        </div>
        <div className="min-h-[20px]">
          {variantImages.length > 1 && (
            <p className="text-xs text-gray-500">
              {variantImages.length} image
              {variantImages.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

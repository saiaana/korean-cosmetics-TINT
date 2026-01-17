import SimilarProductSlider from "../components/ui/sliders/SimilarProductSlider";
import ImagesViewer from "../components/pages/product/ImagesViewer";
import ProductPriceBlock from "../components/pages/product/ProductPriceBlock";
import ProductDescriptionBlock from "../components/pages/product/ProductDescriptionBlock";
import AddToCartButton from "../components/pages/product/AddToCartButton";
import ProductHeader from "../components/pages/product/ProductHeader";
import ProductVariants from "../components/pages/product/ProductVariants";
import { ProductPageSkeleton } from "../components/ui/skeletons";
import useProductPage from "../hooks/useProductPage";
import { useMemo } from "react";
import ProductStockStatusBadge from "../components/pages/product/ProductStockStatusBadge";
import ProductStockStatusNotice from "../components/pages/product/ProductStockStatusNotice";

function Product() {
  const {
    slug,
    product,
    productStatus,
    variants,
    variantsStatus,
    hasVariants,
    selectedVariant,
    handleVariantSelect,
    stockStatus,
    isOutOfStock,
    cart,
    images,
    exceededMaxAvailableQuantity,
  } = useProductPage();

  const addToCartButtonText = useMemo(() => {
    if (hasVariants && !selectedVariant) {
      return "Add to cart";
    }
    if (isOutOfStock) {
      return "Out of stock";
    }
    if (exceededMaxAvailableQuantity) {
      return "Max available quantity reached";
    }
    return cart.existsInCart ? "Add more" : "Add to cart";
  }, [
    hasVariants,
    selectedVariant,
    isOutOfStock,
    exceededMaxAvailableQuantity,
    cart.existsInCart,
  ]);

  const isAddToCartButtonDisabled = useMemo(() => {
    if (exceededMaxAvailableQuantity) return true;
    if (hasVariants) {
      return !selectedVariant || isOutOfStock;
    }
    return isOutOfStock;
  }, [
    selectedVariant,
    hasVariants,
    isOutOfStock,
    exceededMaxAvailableQuantity,
  ]);

  if (productStatus === "loading") {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-stone-500">
        Product not found
        {slug && <span className="mt-2 text-xs">Slug: {slug}</span>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4">
      <ProductHeader
        title={product.title}
        productCategory={product.product_category}
        brand={product.brand}
      />
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        <ImagesViewer images={images} />
        <div className="sticky top-24 flex flex-col gap-6 self-start">
          <ProductPriceBlock
            originalPrice={product.price}
            finalPrice={product.finalPrice}
            isOnSale={product.on_sale}
          />
          {(!hasVariants || selectedVariant) && (
            <ProductStockStatusBadge
              stockStatus={stockStatus}
              stockQuantity={product.stock || selectedVariant?.variant_stock}
            />
          )}

          <ProductDescriptionBlock
            description={product.description}
            howToUse={product.how_to_use}
            volume={product.volume}
            ingridients={product.ingridients}
          />
          <AddToCartButton
            buttonText={addToCartButtonText}
            existingCartQuantity={cart.existingQuantity}
            handleClick={cart.addToCart}
            disabled={isAddToCartButtonDisabled}
          />
          <ProductStockStatusNotice
            hasVariants={hasVariants}
            selectedVariant={selectedVariant}
            productStock={product.stock}
            isOutOfStock={isOutOfStock}
            stockStatus={stockStatus}
            existingCartQuantity={cart.existingQuantity}
          />
        </div>
      </div>
      {variantsStatus === "loading" && (
        <div className="mt-16 flex justify-center">
          <div className="text-gray-500">Loading variants...</div>
        </div>
      )}
      {variantsStatus !== "loading" &&
        Array.isArray(variants) &&
        variants.length > 0 && (
          <div className="mt-16">
            <ProductVariants
              variants={variants}
              productPrice={product.price}
              onVariantSelect={handleVariantSelect}
              selectedVariantId={selectedVariant?.id}
            />
          </div>
        )}
      <div className="mt-16">
        <SimilarProductSlider product={product} />
      </div>
    </div>
  );
}

export default Product;

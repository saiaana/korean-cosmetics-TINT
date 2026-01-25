import VariantForm from "./VariantForm";

export default function StockOptionsSection({
  formData,
  handleInputChange,
  addVariant,
  removeVariant,
  handleVariantChange,
  handleVariantImageChange,
  addVariantImage,
  removeVariantImage,
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-stone-800">Stock & Options</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="has_variants"
            checked={formData.has_variants}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
          />
          <label className="text-sm font-medium text-stone-700">
            Has Variants
          </label>
        </div>
        {!formData.has_variants && (
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>
        )}
        {formData.has_variants && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stone-800">
                Product Variants
              </h3>
              <button
                type="button"
                onClick={addVariant}
                className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
              >
                + Add Variant
              </button>
            </div>
            {formData.variants.length === 0 && (
              <p className="text-sm text-stone-500">
                No variants added yet. Click &quot;Add Variant&quot; to create one.
              </p>
            )}
            {formData.variants.map((variant, variantIndex) => (
              <VariantForm
                key={variantIndex}
                variant={variant}
                variantIndex={variantIndex}
                handleVariantChange={handleVariantChange}
                handleVariantImageChange={handleVariantImageChange}
                addVariantImage={addVariantImage}
                removeVariantImage={removeVariantImage}
                removeVariant={removeVariant}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="on_sale"
            checked={formData.on_sale}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
          />
          <label className="text-sm font-medium text-stone-700">On Sale</label>
        </div>
        {formData.on_sale && (
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Discount Percent
            </label>
            <input
              type="number"
              name="discount_percent"
              required={formData.on_sale}
              value={formData.discount_percent}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
          />
          <label className="text-sm font-medium text-stone-700">
            Bestseller
          </label>
        </div>
      </div>
    </div>
  );
}

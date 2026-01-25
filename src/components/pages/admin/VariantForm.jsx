export default function VariantForm({
  variant,
  variantIndex,
  handleVariantChange,
  handleVariantImageChange,
  addVariantImage,
  removeVariantImage,
  removeVariant,
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold text-stone-800">Variant {variantIndex + 1}</h4>
        <button
          type="button"
          onClick={() => removeVariant(variantIndex)}
          className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
        >
          Remove
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Variant Title *
          </label>
          <input
            type="text"
            value={variant.variant_title}
            onChange={(e) =>
              handleVariantChange(variantIndex, "variant_title", e.target.value)
            }
            placeholder="e.g., 50ml, Large, Red"
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Price (in dollars) *
          </label>
          <input
            type="number"
            step="0.01"
            value={variant.variant_price}
            onChange={(e) =>
              handleVariantChange(variantIndex, "variant_price", e.target.value)
            }
            min="0"
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Stock *
          </label>
          <input
            type="number"
            value={variant.variant_stock}
            onChange={(e) =>
              handleVariantChange(variantIndex, "variant_stock", e.target.value)
            }
            min="0"
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-stone-700">
            Variant Images
          </label>
          <button
            type="button"
            onClick={() => addVariantImage(variantIndex)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            + Add Image
          </button>
        </div>
        <div className="space-y-2">
          {variant.images.map((image, imageIndex) => (
            <div key={imageIndex} className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL"
                value={image.url}
                onChange={(e) =>
                  handleVariantImageChange(
                    variantIndex,
                    imageIndex,
                    "url",
                    e.target.value
                  )
                }
                className="flex-1 rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={image.is_main}
                  onChange={(e) =>
                    handleVariantImageChange(
                      variantIndex,
                      imageIndex,
                      "is_main",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                />
                <span className="text-sm text-stone-700">Main</span>
              </label>
              {variant.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariantImage(variantIndex, imageIndex)}
                  className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

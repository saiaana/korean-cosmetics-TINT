const CATEGORIES_OPTIONS = [
  "anti-age",
  "moisturizers",
  "foundation",
  "makeup",
  "cleanser",
  "acne",
  "hair",
];

export default function BasicInfoSection({
  formData,
  dbCategories,
  handleInputChange,
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-stone-800">Basic Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Brand *
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
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
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Product Category *
          </label>
          <select
            name="product_category"
            value={formData.product_category}
            onChange={handleInputChange}
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="">Select category</option>
            {CATEGORIES_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Category ID (optional)
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="">None</option>
            {dbCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title} (ID: {cat.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Product Type
          </label>
          <input
            type="text"
            name="product_type"
            value={formData.product_type}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </div>
      </div>
    </div>
  );
}

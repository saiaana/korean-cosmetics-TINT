export default function ImagesSection({
  images,
  handleImageChange,
  addImageField,
  removeImageField,
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-stone-800">Images</h2>
      <div className="space-y-4">
        {images.map((image, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Image URL"
              value={image.url}
              onChange={(e) => handleImageChange(index, "url", e.target.value)}
              className="flex-1 rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={image.is_main}
                onChange={(e) =>
                  handleImageChange(index, "is_main", e.target.checked)
                }
                className="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
              />
              <span className="text-sm text-stone-700">Main</span>
            </label>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Add Image
        </button>
      </div>
    </div>
  );
}

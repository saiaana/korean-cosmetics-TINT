import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { createProduct, getCategoriesList } from "../api/productsApi";
import { auth } from "../../firebase";
import ROUTES from "../constants/routes";
import Loading from "./Loading";

const CATEGORIES_OPTIONS = [
  "anti-age",
  "moisturizers",
  "foundation",
  "makeup",
  "cleanser",
  "acne",
  "hair",
];

function AddProduct() {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    price: "",
    product_category: "",
    category_id: "",
    additional_category: "",
    additional_category_id: "",
    product_type: "",
    description: "",
    how_to_use: "",
    volume: "",
    ingridients: "",
    stock: "",
    has_variants: false,
    on_sale: false,
    discount_percent: "",
    bestseller: false,
    images: [{ url: "", is_main: true, position: 0 }],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategoriesList();
        setDbCategories(categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, field, value) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url: "", is_main: false, position: prev.images.length },
      ],
    }));
  };

  const removeImageField = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Подготовка данных
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: formData.has_variants ? null : parseInt(formData.stock) || 0,
        discount_percent: formData.on_sale
          ? parseInt(formData.discount_percent) || 0
          : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        additional_category_id: formData.additional_category_id
          ? parseInt(formData.additional_category_id)
          : null,
        images: formData.images.filter((img) => img.url.trim() !== ""),
      };

      await createProduct(productData, token);
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthInitialized) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold text-stone-800">
          Add New Product
        </h1>
        <p className="text-stone-600">Create a new product in the catalog</p>
      </div>

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
          Product created successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-stone-800">
            Basic Information
          </h2>
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

        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-stone-800">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                How to Use
              </label>
              <textarea
                name="how_to_use"
                value={formData.how_to_use}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Ingredients
              </label>
              <textarea
                name="ingridients"
                value={formData.ingridients}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Volume
              </label>
              <input
                type="text"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
            </div>
          </div>
        </div>

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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="on_sale"
                checked={formData.on_sale}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
              />
              <label className="text-sm font-medium text-stone-700">
                On Sale
              </label>
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

        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-stone-800">Images</h2>
          <div className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={image.url}
                  onChange={(e) =>
                    handleImageChange(index, "url", e.target.value)
                  }
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
                {formData.images.length > 1 && (
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-stone-800 px-6 py-3 font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-lg border border-stone-300 bg-white px-6 py-3 font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;

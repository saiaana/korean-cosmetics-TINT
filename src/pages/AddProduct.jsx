import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import ROUTES from "../constants/routes";
import Loading from "./Loading";
import AdminPageReturnButton from "../components/pages/admin/AdminPageReturnButton";
import useAddProduct from "../hooks/useAddProduct";
import BasicInfoSection from "../components/pages/admin/BasicInfoSection";
import DescriptionSection from "../components/pages/admin/DescriptionSection";
import StockOptionsSection from "../components/pages/admin/StockOptionsSection";
import ImagesSection from "../components/pages/admin/ImagesSection";

function AddProduct() {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);
  const navigate = useNavigate();

  const {
    isEditMode,
    loading,
    loadingProduct,
    error,
    success,
    formData,
    dbCategories,
    handleInputChange,
    handleImageChange,
    addImageField,
    removeImageField,
    handleVariantChange,
    addVariant,
    removeVariant,
    handleVariantImageChange,
    addVariantImage,
    removeVariantImage,
    handleSubmit,
  } = useAddProduct();

  if (!isAuthInitialized) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (loadingProduct) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <AdminPageReturnButton />

        <h1 className="mb-2 text-3xl font-extrabold text-stone-800">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-stone-600">
          {isEditMode
            ? "Update product information"
            : "Create a new product in the catalog"}
        </p>
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
        <BasicInfoSection
          formData={formData}
          dbCategories={dbCategories}
          handleInputChange={handleInputChange}
        />

        <DescriptionSection
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <StockOptionsSection
          formData={formData}
          handleInputChange={handleInputChange}
          addVariant={addVariant}
          removeVariant={removeVariant}
          handleVariantChange={handleVariantChange}
          handleVariantImageChange={handleVariantImageChange}
          addVariantImage={addVariantImage}
          removeVariantImage={removeVariantImage}
        />

        <ImagesSection
          images={formData.images}
          handleImageChange={handleImageChange}
          addImageField={addImageField}
          removeImageField={removeImageField}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-stone-800 px-6 py-3 font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Product"
                : "Create Product"}
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

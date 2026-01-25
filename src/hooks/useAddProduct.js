import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createProduct,
  getCategoriesList,
  getAdminProductById,
  updateProduct,
  getProductVariants,
} from "../api/productsApi";
import { auth } from "../../firebase";

const INITIAL_FORM_DATA = {
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
  variants: [],
};

export default function useAddProduct() {
  const { productId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const isEditMode = !!productId;
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // Fetch categories
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

  // Fetch product for editing
  useEffect(() => {
    if (isEditMode && productId && user) {
      const fetchProduct = async () => {
        setLoadingProduct(true);
        setError(null);
        try {
          const token = await auth.currentUser?.getIdToken();
          if (!token) {
            throw new Error("Authentication required");
          }

          const product = await getAdminProductById(parseInt(productId, 10), token);

          // Get variants if they exist
          let variants = [];
          if (product.has_variants) {
            try {
              const variantsData = await getProductVariants(parseInt(productId, 10));
              variants = (variantsData.variants || []).map((variant) => ({
                variant_title: variant.variant_title || "",
                variant_price: variant.variant_price
                  ? variant.variant_price.toString()
                  : "",
                variant_stock: variant.variant_stock
                  ? variant.variant_stock.toString()
                  : "",
                images:
                  Array.isArray(variant.images) && variant.images.length > 0
                    ? variant.images.map((img) => ({
                        url: img.url || "",
                        is_main: img.is_main || false,
                        position: img.position || 0,
                      }))
                    : [{ url: "", is_main: true, position: 0 }],
              }));
            } catch (err) {
              console.error("Failed to fetch variants:", err);
            }
          }

          // Parse images, if it's a JSON string
          let images = [];
          if (product.images) {
            if (typeof product.images === "string") {
              try {
                images = JSON.parse(product.images);
              } catch (e) {
                images = [];
              }
            } else if (Array.isArray(product.images)) {
              images = product.images;
            } else {
              images = [];
            }
          }

          if (images.length === 0) {
            images = [{ url: "", is_main: true, position: 0 }];
          }

          setFormData({
            title: product.title || "",
            brand: product.brand || "",
            price: product.price ? product.price.toString() : "",
            product_category: product.product_category || "",
            category_id: product.category_id ? product.category_id.toString() : "",
            additional_category: product.additional_category || "",
            additional_category_id: product.additional_category_id
              ? product.additional_category_id.toString()
              : "",
            product_type: product.product_type || "",
            description: product.description || "",
            how_to_use: product.how_to_use || "",
            volume: product.volume || "",
            ingridients: product.ingridients || "",
            stock: product.stock ? product.stock.toString() : "",
            has_variants: product.has_variants || false,
            on_sale: product.on_sale || false,
            discount_percent: product.discount_percent
              ? product.discount_percent.toString()
              : "",
            bestseller: product.bestseller || false,
            images: images.map((img) => ({
              url: img.url || "",
              is_main: img.is_main || false,
              position: img.position || 0,
            })),
            variants: variants,
          });
        } catch (err) {
          setError(err.message || "Failed to fetch product");
        } finally {
          setLoadingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [isEditMode, productId, user]);

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

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variant_title: "",
          variant_price: "",
          variant_stock: "",
          images: [{ url: "", is_main: true, position: 0 }],
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantImageChange = (variantIndex, imageIndex, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const variant = newVariants[variantIndex];
      const newImages = [...variant.images];
      newImages[imageIndex] = { ...newImages[imageIndex], [field]: value };
      newVariants[variantIndex] = { ...variant, images: newImages };
      return { ...prev, variants: newVariants };
    });
  };

  const addVariantImage = (variantIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const variant = newVariants[variantIndex];
      newVariants[variantIndex] = {
        ...variant,
        images: [
          ...variant.images,
          {
            url: "",
            is_main: false,
            position: variant.images.length,
          },
        ],
      };
      return { ...prev, variants: newVariants };
    });
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const variant = newVariants[variantIndex];
      newVariants[variantIndex] = {
        ...variant,
        images: variant.images.filter((_, i) => i !== imageIndex),
      };
      return { ...prev, variants: newVariants };
    });
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

      // Prepare data
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
        variants: formData.has_variants
          ? formData.variants.map((variant) => ({
              variant_title: variant.variant_title,
              variant_price: parseFloat(variant.variant_price) || 0,
              variant_stock: parseInt(variant.variant_stock) || 0,
              images: variant.images.filter((img) => img.url.trim() !== ""),
            }))
          : [],
      };

      if (isEditMode) {
        await updateProduct(parseInt(productId, 10), productData, token);
      } else {
        await createProduct(productData, token);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}

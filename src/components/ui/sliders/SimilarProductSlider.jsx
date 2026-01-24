import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSimilarProducts,
  selectSimilarProducts,
} from "../../../store/slices/productsSlice";
import Slider from "./Slider";

function SimilarProductSlider({ product }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (product?.id && (product?.product_category || product?.brand)) {
      dispatch(
        fetchSimilarProducts({
          category: product.product_category,
          brand: product.brand,
          excludeId: product.id,
        })
      );
    }
  }, [dispatch, product?.id, product?.product_category, product?.brand]);

  const similarProducts = useSelector(selectSimilarProducts);

  // Filter out current product
  const filteredProducts = similarProducts.filter((p) => p.id !== product?.id);

  if (!filteredProducts || filteredProducts.length === 0) {
    return null;
  }

  return <Slider products={filteredProducts} title="you may also like" />;
}

export default SimilarProductSlider;

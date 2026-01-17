import { fetchNewProducts } from "../../../store/slices/productsSlice";
import {
  selectNewProducts,
  selectNewProductsStatus,
} from "../../../store/slices/productsSlice";
import Slider from "./Slider.jsx";
import Loading from "../../../pages/Loading";
import useSliderProducts from "../../../hooks/useSliderProducts.js";

function NewProductsSlider() {
  const { products: newProducts, status } = useSliderProducts({
    productsSelector: selectNewProducts,
    statusSelector: selectNewProductsStatus,
    fetchAction: fetchNewProducts,
  });

  if (status === "loading") {
    return <Loading />;
  }

  if (newProducts && newProducts.length === 0) return null;

  return <Slider products={newProducts} title="new in" />;
}

export default NewProductsSlider;

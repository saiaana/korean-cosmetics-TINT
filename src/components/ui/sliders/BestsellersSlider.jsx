import { fetchBestsellerProducts } from "../../../store/slices/productsSlice";
import {
  selectBestsellerProducts,
  selectBestsellerProductsStatus,
} from "../../../store/slices/productsSlice";
import Slider from "./Slider";
import Loading from "../../../pages/Loading";
import useSliderProducts from "../../../hooks/useSliderProducts.js";

function BestsellersSlider() {
  const { products: bestsellerProducts, status } = useSliderProducts({
    productsSelector: selectBestsellerProducts,
    statusSelector: selectBestsellerProductsStatus,
    fetchAction: fetchBestsellerProducts,
  });

  if (status === "loading") {
    return <Loading />;
  }

  if (bestsellerProducts && bestsellerProducts.length === 0) return null;

  return <Slider products={bestsellerProducts} title="bestsellers" />;
}

export default BestsellersSlider;

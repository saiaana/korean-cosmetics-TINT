import { fetchOnSaleProducts } from "../../../store/slices/productsSlice";
import {
  selectOnSaleProducts,
  selectOnSaleProductsStatus,
} from "../../../store/slices/productsSlice";
import Slider from "./Slider";
import Loading from "../../../pages/Loading";
import useSliderProducts from "../../../hooks/useSliderProducts.js";

function PromotionsSlider() {
  const { products: promotionProducts, status } = useSliderProducts({
    productsSelector: selectOnSaleProducts,
    statusSelector: selectOnSaleProductsStatus,
    fetchAction: fetchOnSaleProducts,
  });

  if (status === "loading") {
    return <Loading />;
  }

  if (promotionProducts && promotionProducts.length === 0) return null;

  return <Slider products={promotionProducts} title="promotions" />;
}

export default PromotionsSlider;

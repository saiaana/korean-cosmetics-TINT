import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCategories from "../components/common/ProductCategories";
import PromotionsSlider from "../components/ui/sliders/PromotionsSlider";
import HeaderSlider from "../components/ui/sliders/HeaderSlider";
import BestsellersSlider from "../components/ui/sliders/BestsellersSlider";
import Locations from "../components/common/Locations";
import NewProductsSlider from "../components/ui/sliders/NewProductsSlider";
import { HomePageSkeleton } from "../components/ui/skeletons";
import {
  selectNewProductsStatus,
  selectOnSaleProductsStatus,
  selectBestsellerProductsStatus,
  fetchNewProducts,
  fetchOnSaleProducts,
  fetchBestsellerProducts,
} from "../store/slices/productsSlice";

function Home() {
  const dispatch = useDispatch();
  const newProductsStatus = useSelector(selectNewProductsStatus);
  const onSaleProductsStatus = useSelector(selectOnSaleProductsStatus);
  const bestsellerProductsStatus = useSelector(selectBestsellerProductsStatus);

  const isInitialLoading =
    newProductsStatus === "loading" ||
    onSaleProductsStatus === "loading" ||
    bestsellerProductsStatus === "loading";
  const [visibleSections, setVisibleSections] = useState({
    categories: true,
    newProducts: true,
    promotions: true,
    bestsellers: true,
    locations: true,
  });

  const newProductsRef = useRef(null);
  const promotionsRef = useRef(null);
  const bestsellersRef = useRef(null);
  const locationsRef = useRef(null);

  // Загружаем данные для всех слайдеров сразу при монтировании
  useEffect(() => {
    if (newProductsStatus === "idle") {
      dispatch(fetchNewProducts({ page: 1, limit: 12, append: false }));
    }
    if (onSaleProductsStatus === "idle") {
      dispatch(fetchOnSaleProducts({ page: 1, limit: 12, append: false }));
    }
    if (bestsellerProductsStatus === "idle") {
      dispatch(fetchBestsellerProducts({ page: 1, limit: 12, append: false }));
    }
  }, [
    dispatch,
    newProductsStatus,
    onSaleProductsStatus,
    bestsellerProductsStatus,
  ]);

  useEffect(() => {
    const observers = [];

    const observeSection = (ref, key) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => ({ ...prev, [key]: true }));
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "100px" }
      );

      observer.observe(ref.current);
      observers.push(observer);
    };

    observeSection(newProductsRef, "newProducts");
    observeSection(promotionsRef, "promotions");
    observeSection(bestsellersRef, "bestsellers");
    observeSection(locationsRef, "locations");

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  if (isInitialLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-between overflow-x-hidden">
      <HeaderSlider />
      <div>
        <ProductCategories />
      </div>
      <div className="mt-10 flex flex-col gap-12">
        <div ref={newProductsRef}>
          {visibleSections.newProducts && <NewProductsSlider />}
        </div>
        <div ref={promotionsRef}>
          {visibleSections.promotions && <PromotionsSlider />}
        </div>
        <div ref={bestsellersRef}>
          {visibleSections.bestsellers && <BestsellersSlider />}
        </div>
        <div ref={locationsRef}>
          {visibleSections.locations && <Locations />}
        </div>
      </div>
    </div>
  );
}

export default Home;

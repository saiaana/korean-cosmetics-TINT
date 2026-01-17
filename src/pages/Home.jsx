import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
} from "../store/slices/productsSlice";

function Home() {
  const newProductsStatus = useSelector(selectNewProductsStatus);
  const onSaleProductsStatus = useSelector(selectOnSaleProductsStatus);
  const bestsellerProductsStatus = useSelector(selectBestsellerProductsStatus);

  const isInitialLoading =
    newProductsStatus === "loading" ||
    onSaleProductsStatus === "loading" ||
    bestsellerProductsStatus === "loading";
  const [visibleSections, setVisibleSections] = useState({
    categories: true,
    newProducts: false,
    promotions: false,
    bestsellers: false,
    locations: false,
  });

  const newProductsRef = useRef(null);
  const promotionsRef = useRef(null);
  const bestsellersRef = useRef(null);
  const locationsRef = useRef(null);

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
        { threshold: 0.1, rootMargin: "100px" },
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

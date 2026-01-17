import { Outlet, useMatches } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";
import imagePath from "../../../src/assets/images/mainPage4.png";

function HeroLayout() {
  const matches = useMatches();
  const current = [...matches].reverse().find((match) => match.handle?.label);
  const label =
    typeof current?.handle?.label === "function"
      ? current.handle.label(current.params)
      : current?.handle?.label;

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <ScrollToTop />
      <Header className="z-10" variant="overlay" />
      <main className="relative flex-1 bg-gray-50 pt-14 md:pt-0">
        <div className="relative">
          <img
            src={imagePath}
            alt=""
            className="h-[300px] w-full object-cover sm:h-[350px] md:h-[400px]"
          />
          {label && (
            <div className="absolute inset-0 flex items-end justify-start pb-8 pl-4 sm:pb-10 sm:pl-6 md:pb-12 md:pl-8 lg:pl-16 xl:pl-32">
              <p className="text-2xl font-semibold uppercase text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
                {label}
              </p>
            </div>
          )}
        </div>
        <div className="mx-4 mt-6 sm:mx-6 sm:mt-8 md:mx-8 md:mt-10 lg:mx-12 lg:mt-12 xl:mx-auto xl:max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HeroLayout;


import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";

function MobileLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <ScrollToTop />
      <Header className="z-10" variant="flow" />
      <main className="relative flex-1 bg-gray-50 pt-14 md:pt-0">
        <div className="mx-4 py-6 sm:mx-6 sm:py-8 md:mx-8 md:py-10 lg:mx-12 lg:py-12 xl:mx-auto xl:max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MobileLayout;


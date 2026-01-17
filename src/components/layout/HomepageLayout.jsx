import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";

function HomepageLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <ScrollToTop />
      <Header className="z-10" variant="overlay" />
      <main className="relative flex-1 pt-14 md:pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default HomepageLayout;

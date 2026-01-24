import { useSelector } from "react-redux";
import HeaderCategories from "./Header/HeaderCategories";
import Logo from "../ui/Logo";
import NavBlock from "./Header/NavBlock";
import MobileHeader from "./Header/MobileHeader";

function Header({ variant = "flow" }) {
  const variants = {
    overlay: "absolute bg-transparent",
    flow: "relative bg-stone-800/40",
  };

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum) => sum + 1, 0)
  );

  return (
    <>
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <header
        className={`${variants[variant]} z-40 hidden w-full flex-col justify-center p-4 pb-6 pt-8 transition-colors duration-300 md:flex md:hover:bg-stone-800 md:hover:bg-opacity-70`}
      >
        <div className="mx-4 flex items-center justify-between pb-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs uppercase text-white">
              Korean cosmetics for you
            </p>
          </div>
          <Logo color="white" />
          <NavBlock color="white" cartCount={cartCount} />
        </div>
        <HeaderCategories />
      </header>
    </>
  );
}

export default Header;

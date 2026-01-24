import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBlock from "./NavBlock";
import { MENU_ITEMS } from "../../../constants/menuItems";
import ROUTES from "../../../constants/routes";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum) => sum + 1, 0)
  );

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") closeMenu();
    }
    if (isMenuOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className="fixed top-0 z-50 w-full border-b bg-white/70 backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link
            to={ROUTES.home}
            className="text-2xl font-semibold tracking-tight transition-colors duration-300 hover:text-pink-600"
            aria-label="Go to home"
          >
            TINT
          </Link>

          <div className="flex items-center gap-10">
            <NavBlock color="black" cartCount={cartCount} />
            <BurgerButton onClick={toggleMenu} isOpen={isMenuOpen} />
          </div>
        </div>
      </div>

      <div
        className={[
          "fixed inset-0 z-40 transition-opacity duration-300 md:hidden",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
          "bg-black/40",
        ].join(" ")}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={[
          "fixed bottom-0 left-0 z-50 w-full md:hidden",
          "rounded-t-2xl bg-white p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.18)]",
          "transition-transform duration-300",
          isMenuOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-gray-300" />

        <ul className="space-y-5 text-lg uppercase tracking-wide">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                onClick={closeMenu}
                className="w-full border-b pb-2 text-left transition-colors hover:text-pink-600"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function BurgerButton({ onClick, isOpen }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition active:scale-90"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="black"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  );
}

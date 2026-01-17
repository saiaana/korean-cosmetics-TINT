import { useState } from "react";
import { Link } from "react-router-dom";
import SearchModal from "../../ui/modals/SearchModal";

function NavBlock({ color, cartCount }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const NAV_ITEMS = {
    account: {
      path: "/account",
    },
    cart: {
      path: "/cart",
    },
  };

  return (
    <div className="flex cursor-pointer gap-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={color}
        className="size-5"
        onClick={() => setSearchModalOpen(true)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <Link to={NAV_ITEMS.account.path}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </Link>

      <Link to={NAV_ITEMS.cart.path} className="relative cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993
         1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125
         1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0
         1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625
         10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75
         0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>

        {cartCount > 0 && (
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-pink-600 text-[12px] text-white">
            {cartCount}
          </span>
        )}
      </Link>
      <SearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}

export default NavBlock;

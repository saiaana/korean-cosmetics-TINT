import { useState } from "react";
import CatalogDropdown from "./CatalogDropdown";
import { Link } from "react-router-dom";
import { MENU_ITEMS } from "../../../constants/menuItems";

const baseItemClass = `
  relative inline-block cursor-pointer
  text-xs font-medium uppercase
  transition-colors duration-300
  after:content-['']
  after:absolute after:left-0 after:-bottom-1
  after:h-[2px] after:w-full
  after:scale-x-0 after:origin-left
  after:transition-transform after:duration-300
  hover:after:scale-x-100
`;

function HeaderCategories() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="relative flex justify-center">
      <ul className="flex flex-wrap items-center gap-8 text-white">
        <li
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={` ${baseItemClass} ${isDropdownOpen ? "text-pink-400 after:scale-x-100" : ""} after:bg-pink-600`}
        >
          <span className="flex items-center gap-1">
            products
            <span
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </span>
        </li>

        {isDropdownOpen && (
          <CatalogDropdown closeDropdown={() => setIsDropdownOpen(false)} />
        )}

        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={` ${baseItemClass} after:bg-pink-600 hover:text-pink-400`}
          >
            {item.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
}

export default HeaderCategories;

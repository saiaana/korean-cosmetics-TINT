import { Link } from "react-router-dom";
import ROUTES from "../../constants/routes";

export default function CategoryBrandList({ title, listItems, path }) {
  const getPath = (item) => {
    if (path === "brands") return ROUTES.brand(item.toLowerCase());
    if (path === "categories") return ROUTES.category(item.toLowerCase());
    return "#";
  };

  return (
    <section className="mx-auto max-w-4xl px-4">
      <h2 className="mb-6 text-center text-2xl font-semibold uppercase tracking-wide text-black md:text-3xl">
        {title} on tint
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
        {listItems.map((listItem) => (
          <Link
            to={getPath(listItem)}
            aria-label={`View ${path} ${listItem}`}
            key={listItem}
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm uppercase tracking-wide text-gray-800 transition hover:border-pink-500 hover:text-pink-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 active:scale-95 md:text-base"
          >
            {listItem}
          </Link>
        ))}
      </div>
    </section>
  );
}

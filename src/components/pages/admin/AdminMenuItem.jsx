import { Link } from "react-router-dom";

export default function AdminMenuItem({ title, icon, link, color, description }) {
return(    <Link
    key={link}
    to={link}
    className={`group rounded-xl border-2 p-6 transition-all duration-300 ${color} shadow-sm hover:shadow-md`}
  >
    <div className="mb-4 text-4xl">{icon}</div>
    <h2 className="mb-2 text-xl font-bold text-stone-800 group-hover:text-stone-900">
      {title}
    </h2>
    <p className="text-sm text-stone-600">{description}</p>
    <div className="mt-4 flex items-center text-sm font-medium text-stone-700 group-hover:text-stone-900">
      <span>Go to section</span>
      <svg
        className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  </Link>)
}
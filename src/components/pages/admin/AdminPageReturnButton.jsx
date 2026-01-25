import { Link } from "react-router-dom";

export default function AdminPageReturnButton() {
  return (
    <Link
    to="/admin"
    className="mb-4 inline-flex items-center text-sm text-stone-600 hover:text-stone-800"
  >
    <svg
      className="mr-2 h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
    Back to Admin Panel
  </Link>
  );
}
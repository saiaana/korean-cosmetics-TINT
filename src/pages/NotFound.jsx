import { useNavigate } from "react-router-dom";
import ROUTES from "../constants/routes";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-pink-600">404</h1>
        <h2 className="mb-4 text-3xl font-semibold uppercase text-stone-800">
          Page Not Found
        </h2>
        <p className="mb-8 text-stone-600">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(ROUTES.home)}
            className="rounded-xl bg-pink-600 px-8 py-3 text-sm font-bold uppercase text-white transition hover:bg-pink-700 active:scale-95"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border-2 border-stone-300 bg-white px-8 py-3 text-sm font-bold uppercase text-stone-800 transition hover:border-stone-400 hover:bg-stone-50 active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

import { Link } from "react-router-dom";
import ROUTES from "../../constants/routes";

function Logo({ color }) {
  return (
    <div>
      <Link to={ROUTES.home} className="flex cursor-pointer">
        <p
          className={`text-6xl font-semibold tracking-[-0.09em] text-${color} transition-colors duration-300 hover:text-pink-500`}
        >
          TINT
        </p>
        <p
          className={`w-12 pl-2 pt-2 text-xs uppercase leading-[0.7rem] text-${color} `}
        >
          your k-beauty store
        </p>
      </Link>
    </div>
  );
}

export default Logo;

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../../pages/Loading";
import ROUTES from "../../constants/routes";

export default function ProtectedRoute({ allowedRoles, children }) {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);

  if (!isAuthInitialized) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.account} replace />;
  }

  return children;
}

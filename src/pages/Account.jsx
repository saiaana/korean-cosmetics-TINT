import { Navigate } from "react-router-dom";
import { useUserOrders } from "../hooks/useUserOrders";
import OrderList from "../components/pages/account/OrderList";
import UserInfo from "../components/pages/account/UserInfo";
import ROUTES from "../constants/routes";
import Loading from "./Loading";
import { useSelector } from "react-redux";

function Account() {
  const user = useSelector((state) => state.auth.user);
  const isAuthInitialized = useSelector((state) => state.auth.initialized);

  const { orders, loading: isLoadingOrders, error } = useUserOrders(user?.uid);


  if (!isAuthInitialized) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      <h1 className="mb-8 text-3xl font-extrabold text-stone-800">
        My account
      </h1>
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <UserInfo user={user} />
        <OrderList loading={isLoadingOrders} error={error} orders={orders} />
      </div>
    </div>
  );
}

export default Account;

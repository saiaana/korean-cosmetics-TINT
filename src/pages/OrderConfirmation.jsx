import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../api/ordersApi";
import OrderItemInfo from "../components/pages/order/OrderItemInfo";
import OrderInformation from "../components/pages/order/OrderInformation";
import OrderNotFound from "../components/pages/order/OrderNotFound";
import Loading from "./Loading.jsx";

function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return <OrderNotFound />;
  }


  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4">
      <OrderInformation order={order} />
      <OrderItemInfo order={order} />
    </div>
  );
}

export default OrderConfirmation;

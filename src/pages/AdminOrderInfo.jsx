import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOrderById } from "../api/ordersApi";
import Loading from "./Loading";
import OrderConfirmation from "./OrderConfirmation";

export default function AdminOrderInfo() {
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

  return (
    <div>
      {loading && <Loading />}
      {error && <div>{error}</div>}
      {order && <OrderConfirmation order={order} />}
    </div>
  );
}

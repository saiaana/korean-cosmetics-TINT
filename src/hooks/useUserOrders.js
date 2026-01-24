import { useEffect, useState } from "react";
import { getUserOrders } from "../api/ordersApi";

export function useUserOrders(uid) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserOrders(uid);
        setOrders(data || []);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("User orders error:", err);
        }
        if (
          err.message?.includes("User not found") ||
          err.message?.includes("user not found")
        ) {
          setOrders([]);
          setError(null);
        } else {
          setError(err.message || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [uid]);

  return { orders, loading, error };
}

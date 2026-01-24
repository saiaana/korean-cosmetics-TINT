import { useState, useEffect } from "react";
import { getAllOrders } from "../api/ordersApi";
import { auth } from "../../firebase";
import { updateOrderStatus } from "../api/ordersApi";

export function useAdminOrder(user) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
  
    useEffect(() => {
      const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getAllOrders(page, 20);
          setOrders(data.orders || []);
          setHasMore(data.hasMore || false);
          setTotal(data.total || 0);
        } catch (err) {
          setError(err.message || "Failed to fetch orders");
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, [page]);

    const handleStatusChange = async (orderId, newStatus) => {
        if (!user) return;
    
        setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));
    
        try {
          const token = await auth.currentUser?.getIdToken();
    
          if (!token) {
            throw new Error("Authentication required");
          }
    
          const updatedOrder = await updateOrderStatus(orderId, newStatus, token);
    
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderId
                ? { ...order, status: updatedOrder.status }
                : order
            )
          );
        } catch (err) {
          console.error("Error updating order status:", err);
          alert(err.message || "Failed to update order status");
        } finally {
          setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
        }
      };


    return { orders, loading, error, updatingStatus, page, hasMore, total, handleStatusChange, setPage };
}
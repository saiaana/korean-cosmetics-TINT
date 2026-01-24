import { useState, useEffect } from "react";
import { getPopularProducts } from "../api/statsApi";
import { auth } from "../../firebase";

export function useAdminStats(user, limit = 20) {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          throw new Error("Authentication required");
        }

        const data = await getPopularProducts(limit, token);
        setPopularProducts(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, limit]);

  return { popularProducts, loading, error };
}

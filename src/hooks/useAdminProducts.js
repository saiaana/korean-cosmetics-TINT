import { useState, useEffect } from "react";
import { getAllAdminProducts } from "../api/productsApi";
import { auth } from "../../firebase";
import { updateProductActiveStatus } from "../api/productsApi";
import { useCallback } from "react";

export function useAdminProducts(user) {
    const [updatingIds, setUpdatingIds] = useState(new Set());
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  

      const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getAllAdminProducts();
          setAllProducts(data);
        } catch (err) {
          setError(err.message || "Failed to fetch products");
        } finally {
          setLoading(false);
        }
      }, []);

      useEffect(() => {
        fetchProducts();
      }, [fetchProducts]);


    const toggleActive = useCallback(async (productId, currentStatus) => {
        if (!user) return;
    
        setUpdatingIds((prev) => new Set(prev).add(productId));
    
        try {
          const token = await auth.currentUser?.getIdToken();
          if (!token) {
            throw new Error("Authentication required");
          }
    
          const newStatus = !currentStatus;
          await updateProductActiveStatus(productId, newStatus, token);
    
          // Обновляем локальное состояние
          setAllProducts((prev) =>
            prev.map((product) =>
              product.id === productId
                ? { ...product, is_active: newStatus }
                : product
            )
          );
        } catch (err) {
          setError(err.message || "Failed to update product status");
        } finally {
          setUpdatingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        }
      }, [user]);

  return { allProducts, loading, error, toggleActive, updatingIds };
}
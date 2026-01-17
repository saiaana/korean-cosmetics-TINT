import { useDispatch, useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { searchProducts } from "../store/slices/searchSlice";
import { clearSearch } from "../store/slices/searchSlice";
import { setQuery } from "../store/slices/searchSlice";

export default function useProductSearch(isOpen) {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const {
    query = "",
    results = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.search || {});

  useEffect(() => {
    if (!isOpen) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query || query.trim().length < 2) {
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const t = setTimeout(() => {
      dispatch(searchProducts({ query, signal: abortController.signal }));
    }, 300);

    return () => {
      clearTimeout(t);
      abortController.abort();
    };
  }, [query, dispatch, isOpen]);

  const updateQuery = (value) => {
    dispatch(setQuery(value));
  };

  const resetSearch = () => {
    dispatch(clearSearch());
  };

  return {
    query,
    results,
    loading,
    error,
    updateQuery,
    resetSearch,
  };
}

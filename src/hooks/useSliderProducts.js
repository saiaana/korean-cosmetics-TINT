import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function useSliderProducts({
  productsSelector,
  statusSelector,
  fetchAction,
}) {
  const dispatch = useDispatch();
  const products = useSelector(productsSelector);
  const status = useSelector(statusSelector);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAction());
    }
  }, [dispatch, status, fetchAction]);

  return { products, status };
}

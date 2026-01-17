import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import ROUTES from "../constants/routes";
import { handleCheckout } from "../utils/order/checkout";
import { selectSelectedItems } from "../features/cart/selectors/cartSelectors";
import { selectSelectedItemsTotal } from "../features/cart/selectors/cartSelectors";
import { deleteSelectedCartItems } from "../store/slices/cartSlice";

export default function useCreateOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedItems = useSelector(selectSelectedItems);
  const totalPrice = useSelector(selectSelectedItemsTotal);
  const { user, initialized: isAuthInitialized } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    if (!isAuthInitialized) {
      return;
    }

    if (!user) {
      navigate(ROUTES.login);
      return;
    }

    const nameParts = user.displayName?.split(" ") || [];

    setFormData((prev) => ({
      ...prev,
      firstName: nameParts[0] || "",
      lastName: nameParts[1] || "",
      email: user.email || "",
    }));
  }, [user, isAuthInitialized, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isDisabled = selectedItems.length === 0 || totalPrice === 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isDisabled) {
      alert("Please select at least one item to checkout");
      return;
    }

    handleCheckout(
      formData,
      selectedItems,
      auth,
      dispatch,
      navigate,
      deleteSelectedCartItems,
    );
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    selectedItems,
    totalPrice,
    isDisabled,
  };
}

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { signUpUser } from "../auth/signUpUser";
import { mergeGuestCart } from "../store/slices/cartSlice";
import ROUTES from "../constants/routes";
import {
  areAllFieldsFilled,
  isValidEmail,
  isValidPassword,
} from "../utils/validation";

export default function useSignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, initialized: isAuthInitialized } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user) {
      navigate(ROUTES.account);
    }
  }, [user, isAuthInitialized, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!areAllFieldsFilled(formData)) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordErrors = isValidPassword(formData.password);

    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(", "));
      return;
    }

    try {
      setIsLoading(true);

      await signUpUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      await dispatch(mergeGuestCart());

      navigate(ROUTES.account);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Something went wrong. Try again.");
        if (import.meta.env.DEV) {
          console.error("Sign up error:", err);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSignUp,
    isAuthInitialized,
  };
}

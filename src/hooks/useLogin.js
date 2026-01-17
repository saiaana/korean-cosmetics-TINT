import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { mergeGuestCart } from "../store/slices/cartSlice";
import ROUTES from "../constants/routes";

export default function useLogin() {
  const { user, initialized: isAuthInitialized } = useSelector(
    (state) => state.auth,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(ROUTES.account);
    }
  }, [user, isAuthInitialized, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await dispatch(mergeGuestCart());

      setIsLoading(false);
      navigate(ROUTES.account);
    } catch (err) {
      setIsLoading(false);
      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            setError("Invalid email or password");
            break;
          case "auth/invalid-email":
            setError("Invalid email address");
            break;
          case "auth/too-many-requests":
            setError("Too many attempts. Try again later.");
            break;
          case "auth/network-request-failed":
            setError("Network error. Please check your connection.");
            break;
          default:
            setError("Something went wrong. Please try again.");
            if (import.meta.env.DEV) {
              console.error("Unhandled login error code:", err.code);
            }
        }
      } else {
        setError("Something went wrong. Please try again.");
        if (import.meta.env.DEV) {
          console.error("Login error without code:", err);
        }
      }
    }
  };

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleLogin,
    isAuthInitialized,
  };
}

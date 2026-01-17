import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../constants/routes";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

export default function useLogout() {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const requestLogout = () => {
    setIsConfirmOpen(true);
  };

  const cancelLogout = () => {
    setIsConfirmOpen(false);
  };

  const confirmLogout = async () => {
    try {
      setIsLoading(true);
      setIsConfirmOpen(false);
      await signOut(auth);
      navigate(ROUTES.login);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Logout error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConfirmOpen,
    isLoading,
    requestLogout,
    cancelLogout,
    confirmLogout,
  };
}

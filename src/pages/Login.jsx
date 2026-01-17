import { Link } from "react-router-dom";
import LoginForm from "../components/ui/forms/LoginForm";
import ROUTES from "../constants/routes";
import SubmitButton from "../components/ui/forms/SubmitButton";
import AuthFormLayout from "../components/ui/AuthFormLayout";
import useLogin from "../hooks/useLogin";

export default function Login() {
  const { formData, error, isLoading, handleChange, handleLogin } = useLogin();

  return (
    <AuthFormLayout
      title="Login"
      error={error}
      isLoading={isLoading}
      onSubmit={handleLogin}
    >
      <LoginForm formData={formData} onChange={handleChange} />
      <SubmitButton
        isLoading={isLoading}
        text="Login"
        loadingText="Logging in..."
      />
      <p className="mt-4 text-center text-sm text-gray-600">
        Do not have an account yet? {"  "}
        <Link
          to={ROUTES.signup}
          className="font-semibold text-pink-600 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </AuthFormLayout>
  );
}

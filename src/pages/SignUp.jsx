import { Link } from "react-router-dom";
import SignUpForm from "../components/ui/forms/SignUpForm";
import ROUTES from "../constants/routes";
import SubmitButton from "../components/ui/forms/SubmitButton";
import AuthFormLayout from "../components/ui/AuthFormLayout";
import Loading from "./Loading";
import useSignUp from "../hooks/useSignUp";

function SignUp() {
  const {
    formData,
    error,
    isLoading,
    handleChange,
    handleSignUp,
    isAuthInitialized,
  } = useSignUp();

  if (!isAuthInitialized) {
    return <Loading />;
  }

  return (
    <AuthFormLayout
      title="Create an account"
      error={error}
      isLoading={isLoading}
      onSubmit={handleSignUp}
    >
      <SignUpForm formData={formData} onChange={handleChange} />
      <SubmitButton
        isLoading={isLoading}
        text="Sign up"
        loadingText="Creating..."
      />
      <p className="mt-4 text-center text-sm text-gray-600">
        You have an account?
        <Link
          to={ROUTES.login}
          className="font-semibold text-pink-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthFormLayout>
  );
}

export default SignUp;

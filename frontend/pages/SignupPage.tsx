import React from "react";
import AuthForm from "../components/AuthForm";
import { User } from "../types";

interface SignupPageProps {
  onSignup: (user: User) => void;
  onNavigateToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <AuthForm
        initialActive={true}
        onSignup={onSignup}
        onNavigateToLogin={onNavigateToLogin}
      />
    </div>
  );
};

export default SignupPage;

import React from "react";
import AuthForm from "../components/AuthForm";
import { User } from "../types";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <AuthForm onLogin={onLogin} onNavigateToSignup={onNavigateToSignup} />
    </div>
  );
};

export default LoginPage;

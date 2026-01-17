"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "./components/loginForm";
import SignUpForm from "./components/signUpForm";

const LoginRegistration = () => {
  const searchParams = useSearchParams();
  const [tab, toggleTab] = useState("login");

  // OAuth callback:
  // /login_registration?tab=signUp&method=google&step=3
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const method = searchParams.get("method");

    if (tabParam === "signUp" || method === "google") {
      toggleTab("signUp");
    }
  }, [searchParams]);

  return (
    <div className="fixed inset-0 z-50 bg-amber-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Welcome to Pharmart
        </h2>

        <p className="text-center text-gray-500 text-sm">
          Register if you are a new user, or login if you already have an account.
        </p>

        {/* Tabs */}
        <div className="flex justify-center space-x-6 border-b pb-2">
          <button
            onClick={() => toggleTab("login")}
            className={`pb-1 ${
              tab === "login"
                ? "font-semibold text-green-700 border-b-2 border-green-700"
                : "text-gray-600"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => toggleTab("signUp")}
            className={`pb-1 ${
              tab === "signUp"
                ? "font-semibold text-green-700 border-b-2 border-green-700"
                : "text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {tab === "login" ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

export default LoginRegistration;

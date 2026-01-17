"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "./components/loginForm";
import SignUpForm from "./components/signUpForm";

const Login_registration = () => {
  const searchParams = useSearchParams();
  const [tab, toggleTab] = useState("login");

  //callback:  router.replace("/login_registration?tab=signUp&method=google&step=3");
   useEffect(() => {
    const tabParam = searchParams.get("tab");

    if (tabParam === "signUp") {
      toggleTab("signUp");
    }
  }, [searchParams]);

  

  return (
    <div className="fixed inset-0 z-50 bg-amber-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 transform transition-transform duration-500 hover:-translate-y-2">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Welcome to Pharmart
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Register if you are a new user, or login if you already have an
          account.
        </p>

        {/* Tab Switch */}
        <div className="flex justify-center items-center space-x-6 border-b border-gray-200 pb-2">
          <button
            className={`text-lg tracking-tight pb-1 transition-colors duration-300 ${
              tab === "login"
                ? "font-semibold text-green-700 border-b-2 border-green-700"
                : "font-normal text-gray-600 hover:text-green-700"
            }`}
            onClick={() => toggleTab("login")}
          >
            Login
          </button>
          <button
            className={`text-lg tracking-tight pb-1 transition-colors duration-300 ${
              tab === "signUp"
                ? "font-semibold text-green-700 border-b-2 border-green-700"
                : "font-normal text-gray-600 hover:text-green-700"
            }`}
            onClick={() => toggleTab("signUp")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="mt-4">
          {tab === "login" ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
};

export default Login_registration;

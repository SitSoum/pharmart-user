"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";
import Spinner from "@/components/spinner";
import { useState } from "react";
export default function OAuthCallback() {
  const router = useRouter();
  const [step, setStep] = useState("Checking login attempt...");

  useEffect(() => {
    const checkUser = async () => {
      setStep("Verifying Google login attempt...");
      const attempted = localStorage.getItem("google_login_attempt");

      if (!attempted) {
        setStep("Login not attempted. Redirecting...");
        setTimeout(() => router.replace("/login_registration"), 800);
        return;
      }

      setStep("Checking session...");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setStep("No session found. Redirecting to login...");
        setTimeout(() => router.replace("/login_registration"), 800);
        return;
      }

      const user = session.user;

      setStep("Verifying account in database...");
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (!existingUser) {
        setStep("New user detected. Redirecting to registration...");
        setTimeout(() => 
          router.replace(`/login_registration?email=${user.email}&method=google`)
        , 1000);
      } else {
        setStep("Welcome back! Redirecting home...");
        setTimeout(() => router.replace("/home"), 1000);
      }

      localStorage.removeItem("google_login_attempt");
    };

    checkUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <Spinner className="animate-spin w-10 h-10 text-green-600" />
        <h1 className="font-semibold text-lg text-gray-800">Authenticating...</h1>
        <p className="text-gray-600">{step}</p>

        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-4">
          <div className="bg-green-600 h-2 rounded-full transition-all duration-700"
               style={{
                 width:
                   step.includes("login attempt") ? "20%" :
                   step.includes("Checking session") ? "50%" :
                   step.includes("Verifying account") ? "80%" :
                   "100%"
               }}
          />
        </div>
      </div>
    </div>
  );
}

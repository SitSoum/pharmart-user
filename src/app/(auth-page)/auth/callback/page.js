
"use client"


import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import Spinner from "@/components/spinner";

export default function OAuthCallback() {
  const router = useRouter();
  const [step, setStep] = useState("Checking session...");

  useEffect(() => {
    const run = async () => {
      // STEP 1: SET SESSION FROM URL HASH
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        setStep("Setting session...");
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error(error);
          router.replace("/login_registration");
          return;
        }
      }

      // STEP 2: GET SESSION
      setStep("Fetching session...");
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        setStep("No session found. Redirecting...");
        setTimeout(() => router.replace("/login_registration"), 800);
        return;
      }

      const user = data.session.user;

      // STEP 3: CHECK USER IN DB
      setStep("Checking account...");
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      // 🆕 NEW USER
      if (!existingUser) {
        setStep("Creating account...");
        await supabase.from("users").insert({
          auth_id: user.id,
          email: user.email,
          first_name: user.user_metadata?.given_name || "",
          last_name: user.user_metadata?.family_name || "",
          role: "user",
        });

        router.replace("/login_registration?tab=signUp&method=google&step=3");
        return;
      }

      // 🧭 ROLE-BASED REDIRECT
      setStep("Redirecting...");
      switch (existingUser.role) {
        case "admin":
          router.replace("/admin");
          break;

        case "owner":
          router.replace("/store-owner");
          break;

        default:
          router.replace("/home");
      }
    };

    run();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
      <p className="ml-4">{step}</p>
    </div>
  );
}

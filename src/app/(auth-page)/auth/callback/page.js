"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";
import Spinner from "@/components/spinner";

export default function OAuthCallback() {
  const router = useRouter();
  const [step, setStep] = useState("Checking session...");

  useEffect(() => {
    const run = async () => {
      setStep("Fetching session...");

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        setStep("No session found. Redirecting...");
        setTimeout(() => router.replace("/login_registration"), 800);
        return;
      }

      const user = data.session.user;

      setStep("Checking account...");
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (!existingUser) {
        setStep("New user. Redirecting...");
        router.replace(
          `/login_registration?email=${user.email}&method=google`
        );
      } else {
        setStep("Welcome back!");
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

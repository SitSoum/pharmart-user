"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";
import Swal from "sweetalert2";

export default function Protected({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // 1. Check Supabase session
      //valid,? unexpired session? stored in the local storage (or cookies) of the browser/client.
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.replace("/login_registration");
        return;
      }

      const authUser = sessionData.session.user;

      // 2. Check user in custom table
      const { data: userRecord } = await supabase
        .from("users")
        .select("*")
        .eq("email", authUser.email)
        .maybeSingle();

      if (!userRecord) {
        // Not registered in custom db
        router.replace("/login_registration");
        return;
      }

      // 3. Check role
      if (userRecord.role !== "user") {
        router.replace("/login_registration");
        //alert("Account role mismatch")
         Swal.fire({title: "Account role mismatch", icon: "error",confirmButtonText: "OK"});
        return;
      }

      localStorage.setItem(
        "user_info",
        JSON.stringify({
          id: userRecord.id,
          email: userRecord.email,
          first_name: userRecord.first_name,
          last_name: userRecord.last_name,
          phone_number: userRecord.phone_number,
          role: userRecord.role,
        })
      );

      console.log(localStorage)

      

      // 4. Allowed!
      setAllowed(true);
    };

    checkUser();
  }, [router]);

  if (!allowed) return null; // prevent flicker
  return <>{children}</>;
}

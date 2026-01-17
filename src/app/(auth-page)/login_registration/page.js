import { Suspense } from "react";
import LoginRegistration from "./LoginRegistration";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <LoginRegistration />
    </Suspense>
  );
}

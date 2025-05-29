"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/sign-up");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p>Redirection vers la page d&apos;authentification...</p>
    </div>
  );
}

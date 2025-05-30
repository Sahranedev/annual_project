"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function SignOutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
    router.push("/(auth)/sign-up");
  }, [logout, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Déconnexion en cours...</p>
    </div>
  );
}

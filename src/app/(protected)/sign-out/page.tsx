"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function SignOutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Déconnexion en cours...</h1>
      <p>Vous allez être redirigé vers la page d&apos;accueil.</p>
    </div>
  );
}

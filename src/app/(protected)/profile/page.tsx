// src/app/(protected)/profile/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/(auth)/sign-in");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement…</p>
      </div>
    );
  }

  // À ce stade loading = false et isAuthenticated = true
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Bienvenue, {user?.username} !</h1>
      <p>ID : {user?.id}</p>
      {/* le reste de ton profil */}
    </div>
  );
}

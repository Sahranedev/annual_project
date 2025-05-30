"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/authStore";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/(auth)/sign-up");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/(auth)/sign-up");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement…</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Bienvenue, {user?.username} !</h1>
      <p>ID : {user?.id}</p>
      <button
        className="mt-4 bg-pink-100 px-4 py-2 rounded hover:bg-pink-200"
        onClick={handleLogout}
      >
        Se déconnecter
      </button>
    </div>
  );
}

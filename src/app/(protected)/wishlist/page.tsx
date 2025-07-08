"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function WishlistPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Ma liste de souhaits</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            Votre liste de souhaits est vide
          </p>
          <p className="text-gray-500">
            Ajoutez des produits à votre liste de souhaits en cliquant sur le
            cœur dans la page produit
          </p>
        </div>
      </div>
    </div>
  );
}

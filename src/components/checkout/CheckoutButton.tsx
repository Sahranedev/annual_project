"use client";

import { useState } from "react";
import { useCartStore } from "@/app/store/cartStore";
import { useAuthStore } from "@/app/store/authStore";
import { getStripeClient } from "@/lib/stripe";
import { FiLoader } from "react-icons/fi";
import { CartItemForCheckout } from "@/types/payment";

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({
  className = "",
}: CheckoutButtonProps) {
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Votre panier est vide");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // On extrait les items de notre panier depuis le store les articles pour le checkout
      const checkoutItems: CartItemForCheckout[] = items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.thumbnail,
      }));

      // On envoie les items au backend pour créer une session de paiement
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems,
          customerEmail: user?.email,
          metadata: {
            userId: user?.id?.toString(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur lors de la création de la session de paiement"
        );
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Redirection alternative si l'URL n'est pas fournie
        const stripe = await getStripeClient();
        if (!stripe) {
          throw new Error("Impossible de charger Stripe");
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          throw error;
        }
      }
    } catch (err: unknown) {
      console.error("Erreur de paiement:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className={`w-full flex items-center justify-center px-3 py-3 text-center font-medium text-white disabled:opacity-50 transition-colors ${className}`}
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin mr-2" />
            Traitement en cours...
          </>
        ) : (
          <>Procéder à la commande</>
        )}
      </button>
    </div>
  );
}

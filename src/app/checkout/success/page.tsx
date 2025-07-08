"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cartStore";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  metadata?: Record<string, string>;
}

interface LineItem {
  id: string;
  amount_total: number;
  currency: string;
  description: string;
  quantity: number;
  price?: {
    product: Product;
    unit_amount: number;
  };
}

interface StripeCheckoutSession {
  id: string;
  created: number;
  amount_total: number;
  currency: string;
  customer_email?: string;
  payment_status?: string;
  line_items?: {
    data: LineItem[];
  };
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      postal_code: string;
      city: string;
      country: string;
    };
  };
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clear: clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] =
    useState<StripeCheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    clearCart();

    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`/api/checkout/sessions/${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Erreur lors de la récupération des détails de la commande"
          );
        }

        setOrderDetails(data.session);
      } catch (err: unknown) {
        console.error("Erreur:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, router, clearCart]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <FiLoader className="animate-spin h-10 w-10 text-[#F6B99C] mb-4" />
        <p className="text-gray-600">
          Chargement des détails de votre commande...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md my-10">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            Une erreur est survenue
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2 bg-[#F6B99C] rounded-lg text-white hover:bg-[#e6a98c]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-10">
      <div className="text-center mb-8">
        <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">
          Commande confirmée !
        </h1>
        <p className="text-gray-600 mt-2">
          Merci pour votre achat. Nous avons bien reçu votre commande.
        </p>
      </div>

      {orderDetails && (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4">Détails de la commande</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Numéro de commande
              </h3>
              <p className="text-gray-800 text-sm break-all">
                {orderDetails.id}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Date</h3>
              <p className="text-gray-800">
                {new Date(orderDetails.created * 1000).toLocaleDateString(
                  "fr-FR"
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total</h3>
              <p className="text-gray-800 font-medium">
                {(orderDetails.amount_total / 100).toFixed(2)} €
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Mode de paiement
              </h3>
              <p className="text-gray-800">Carte bancaire</p>
            </div>
          </div>

          {/* Détails des produits achetés */}
          {orderDetails.line_items && orderDetails.line_items.data && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Produits achetés</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {orderDetails.line_items.data.map((item) => (
                    <div key={item.id} className="p-4 flex items-center">
                      {item.price?.product?.images &&
                        item.price.product.images[0] && (
                          <div className="flex-shrink-0 w-16 h-16 mr-4 relative overflow-hidden rounded-md">
                            <Image
                              src={item.price.product.images[0]}
                              alt={item.price.product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 64px"
                            />
                          </div>
                        )}
                      <div className="flex-grow">
                        <h4 className="font-medium">
                          {item.price?.product?.name || item.description}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="mr-2">
                            Quantité: {item.quantity}
                          </span>
                          <span>
                            Prix unitaire:{" "}
                            {item.price?.unit_amount
                              ? (item.price.unit_amount / 100).toFixed(2)
                              : (
                                  item.amount_total /
                                  100 /
                                  item.quantity
                                ).toFixed(2)}{" "}
                            €
                          </span>
                        </div>
                      </div>
                      <div className="font-medium ml-4">
                        {(item.amount_total / 100).toFixed(2)} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {orderDetails.shipping && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Adresse de livraison
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">
                  {orderDetails.shipping.name}
                  <br />
                  {orderDetails.shipping.address.line1}
                  <br />
                  {orderDetails.shipping.address.line2 && (
                    <>
                      {orderDetails.shipping.address.line2}
                      <br />
                    </>
                  )}
                  {orderDetails.shipping.address.postal_code}{" "}
                  {orderDetails.shipping.address.city}
                  <br />
                  {orderDetails.shipping.address.country}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-3 bg-[#F6B99C] rounded-lg text-white hover:bg-[#e6a98c] transition-colors"
        >
          Continuer mes achats
        </Link>

        <Link
          href="/profile"
          className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Voir mon compte
        </Link>
      </div>
    </div>
  );
}

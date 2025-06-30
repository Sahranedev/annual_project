"use client";

import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import SuggestedProducts from "@/components/cart/SuggestedProducts";
import Link from "next/link";
/* J'ai fait le suggest product en dur pour l'instant parce que je ne sais pas sur quel algo se base la prof pour le faire */
const dummySuggestedProducts = [
  {
    id: 101,
    title: "TWISTED | CITADIN•E",
    price: 18.0,
    thumbnail: "",
    quantity: 1,
  },
  {
    id: 102,
    title: "TWISTED | INTEMPOREL•LE",
    price: 16.0,
    thumbnail: "",
    quantity: 1,
  },
];

export default function CartPage() {
  const { items, setSuggestedProducts } = useCartStore();

  useEffect(() => {
    setSuggestedProducts(dummySuggestedProducts);
  }, [setSuggestedProducts]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Panier</h1>
        <div className="text-center py-16">
          <h2 className="text-xl font-medium mb-4">Votre panier est vide</h2>
          <p className="text-gray-500 mb-8">
            Ajoutez des articles à votre panier pour commencer vos achats
          </p>
          <Link
            href="/products"
            className="inline-block rounded-md bg-black px-6 py-3 text-center font-medium text-white hover:bg-gray-800"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Panier</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    PRODUIT
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                  >
                    PRIX
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                  >
                    QUANTITÉ
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                  >
                    TOTAL PRODUIT
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    thumbnail={item.thumbnail}
                    quantity={item.quantity}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <Link
              href="/products"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Continuer mes achats
            </Link>
          </div>

          <SuggestedProducts />
        </div>

        <div className="mt-8 lg:col-span-4 lg:mt-0">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

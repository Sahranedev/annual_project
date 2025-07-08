"use client";

import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import CheckoutButton from "@/components/checkout/CheckoutButton";
import PromoCode from "@/components/cart/PromoCode";
import { formatPrice } from "@/app/utils";
import SuggestedProducts from "@/components/cart/SuggestedProducts";
import CartItem from "@/components/cart/CartItem";
import { FaRegTrashAlt } from "react-icons/fa";

/* J'ai fait le suggest product en dur pour l'instant parce que je ne sais pas sur quel algo se base la prof pour le faire */
const dummySuggestedProducts = [
  {
    id: 3,
    title: "Produit suggéré 1",
    price: 19.99,
    thumbnail: "https://via.placeholder.com/150",
    quantity: 1,
  },
  {
    id: 4,
    title: "Produit suggéré 2",
    price: 29.99,
    thumbnail: "https://via.placeholder.com/150",
    quantity: 1,
  },
];

export default function CartPage() {
  const {
    items,
    setSuggestedProducts,
    remove,
    updateQuantity,
    subtotal,
    total,
    shippingCost,
    promoCode,
  } = useCartStore();

  useEffect(() => {
    setSuggestedProducts(dummySuggestedProducts);
  }, [setSuggestedProducts]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const discountAmount = promoCode
    ? (subtotal() * promoCode.discount) / 100
    : 0;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">Votre panier</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-6">Votre panier est vide</p>
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2 bg-[#F6B99C] rounded-lg text-white hover:bg-[#e6a98c]"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Produit
                  </th>
                  <th
                    scope="cole"
                    className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Prix
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantité
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Prix total
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={item.id} {...item} />
                ))}
              </tbody>
            </table>
          </div>

          <SuggestedProducts />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#D6D0C2] p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">TOTAUX</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-[#303028]">Sous-total</p>
                <p>{formatPrice(subtotal())}</p>
              </div>

              {promoCode && (
                <div className="flex justify-between text-green-600">
                  <p>Réduction ({promoCode.code})</p>
                  <p>-{formatPrice(discountAmount)}</p>
                </div>
              )}

              <div className="flex justify-between">
                <p className="text-[#303028]">Shipping</p>
                <p>
                  {shippingCost > 0
                    ? formatPrice(shippingCost)
                    : "Calculer les frais d'expédition"}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <p className="text-[#515047]">Total</p>
                  <p>{formatPrice(total())}</p>
                </div>
              </div>
            </div>

            <PromoCode />

            <div className="mt-6">
              <CheckoutButton className="bg-[#303028] hover:bg-rose-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import PromoCode from "./PromoCode";
import { formatPrice } from "@/app/utils";

export default function CartSummary() {
  const { subtotal, total, shippingCost, promoCode } = useCartStore();

  const discountAmount = promoCode
    ? (subtotal() * promoCode.discount) / 100
    : 0;

  return (
    <div className=" bg-[#D6D0C2] p-6">
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

      <Link
        href="/checkout"
        className="mt-6 block w-full  bg-[#303028] px-3 py-3 text-center font-medium text-white hover:bg-rose-400"
      >
        Procéder à la commande
      </Link>
    </div>
  );
}

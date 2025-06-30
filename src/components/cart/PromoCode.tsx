"use client";

import { useState } from "react";
import { useCartStore } from "@/app/store/cartStore";

export default function PromoCode() {
  const { applyPromoCode, promoCode, removePromoCode } = useCartStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApplyCode = () => {
    if (!code) return;

    setError("");
    const success = applyPromoCode(code);

    if (!success) {
      setError("Code promo invalide");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code promo"
          className="mr-2 flex-1 rounded-md border p-2 border-[#303028] bg-gray-50"
          disabled={promoCode !== null}
        />
        {promoCode ? (
          <button
            type="button"
            onClick={removePromoCode}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Retirer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApplyCode}
            className=" bg-[#a79276] px-4 py-2 text-[#303028] hover:bg-gray-700"
          >
            Valider
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {promoCode && (
        <div className="mt-2 rounded-md bg-green-100 p-2 text-green-800">
          <p className="text-sm font-medium">
            Code appliqué: <span className="font-bold">{promoCode.code}</span>{" "}
            (-{promoCode.discount}%)
          </p>
        </div>
      )}
    </div>
  );
}

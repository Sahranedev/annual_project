"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import { formatPrice } from "@/app/utils";

export default function SuggestedProducts() {
  const { suggestedProducts, add } = useCartStore();

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6 text-[#303028]">
        VOUS SEREZ PEUT-ÊTRE INTÉRESSÉ PAR...
      </h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {suggestedProducts.map((product) => (
          <div key={product.id} className="flex">
            <div className="flex-shrink-0">
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={120}
                height={120}
                className="h-32 w-32 rounded-md object-cover"
              />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <h3 className="text-lg font-medium">
                  <Link
                    href={`/products/${product.id}`}
                    className="hover:underline text-[#303028]"
                  >
                    {product.title}
                  </Link>
                </h3>
                <p className="mt-1 text-base font-medium">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="mt-auto">
                <button
                  type="button"
                  onClick={() => add({ ...product, quantity: 1 })}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

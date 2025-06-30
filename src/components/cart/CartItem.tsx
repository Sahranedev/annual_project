"use client";

import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/app/store/cartStore";
import { formatPrice } from "@/app/utils";

type CartItemProps = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

export default function CartItem({
  id,
  title,
  price,
  thumbnail,
  quantity,
}: CartItemProps) {
  const { updateQuantity, remove } = useCartStore();
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setItemQuantity(newQuantity);
    updateQuantity(id, newQuantity);
  };

  return (
    <tr className="border-b">
      <td className="py-4">
        <div className="flex items-center">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
            <Image
              src={thumbnail}
              alt={title}
              width={80}
              height={80}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
          </div>
        </div>
      </td>
      <td className="py-4 text-center">{formatPrice(price)}</td>
      <td className="py-4">
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="rounded-l bg-gray-200 px-3 py-1 text-sm"
            onClick={() => handleQuantityChange(itemQuantity - 1)}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={itemQuantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="w-12 border-y border-gray-300 py-1 text-center"
          />
          <button
            type="button"
            className="rounded-r bg-gray-200 px-3 py-1 text-sm"
            onClick={() => handleQuantityChange(itemQuantity + 1)}
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4 text-center">{formatPrice(price * quantity)}</td>
      <td className="py-4 text-center">
        <button
          type="button"
          onClick={() => remove(id)}
          className="text-red-500 hover:text-red-700"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}

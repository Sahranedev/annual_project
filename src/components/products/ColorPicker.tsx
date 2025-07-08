import React from "react";
import { ProductColor } from "@/types/product";

interface ColorProps {
  colors: ProductColor[];
  select(colorId: number): void;
}

export default function ColorPicker({ colors, select }: ColorProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
      {colors.map((color) => (
        <button
          key={color.id}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform`}
          style={{ backgroundColor: color?.color?.color }}
          onClick={() => select(color.id)}
          title={color?.color?.label}
        ></button>
      ))}
    </div>
  );
}

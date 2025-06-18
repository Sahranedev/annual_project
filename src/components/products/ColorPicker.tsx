import React from 'react'

interface ColorProps {
  colors: {
    id: number
    name: string
    hex: string
  }[],
  select(colorId: number): void
}

export default function ColorPicker({ colors, select }: ColorProps) {
  return (
    <div className='flex gap-2 mt-2'>
    {colors.map((color) => (
      <button
        key={color.id}
        className={`w-8 h-8 rounded-full border cursor-pointer`}
        style={{ backgroundColor: color.color.color }}
        onClick={() => select(color.id)}
      ></button>
    ))}
    </div>
  )
}

'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  title: string
  slug: string
  price: number
  Promotion: boolean
  discountPercent: number
  images: Array<{
    formats: {
      thumbnail: { url: string }
      large: { url: string }
    }
  }>
  categories: Category[]
}

export default function CreationItem({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }

  return (
    <div 
      key={product.id} 
      className="relative bg-white rounded-lg shadow-md aspect-square" 
      onMouseMove={handleMouseMove} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative size-full overflow-hidden">
        <Image
          src={`http://localhost:1337${product.images[0].formats.large.url}`}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none z-10"
            style={{ 
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              left: 0,
              top: 0
            }}
          >
            <motion.h3 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
              className="text-white origin-top text-2xl font-bold bg-pink-300 px-2"
            >
              {product.title}
            </motion.h3>
            <motion.span 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className='absolute origin-top bg-pink-300 text-white text-sm w-fit text-nowrap px-2'
            >
              {product.categories.map((category) => category.name).join(', ')}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

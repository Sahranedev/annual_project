'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Category {
  id: number
  name: string
}

interface Creation {
  id: number
  name: string
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
  creation_categories: Category[]
}

export default function CreationItem({ creation }: { creation: Creation }) {
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
      key={creation.id} 
      className="relative bg-white rounded-lg shadow-md aspect-square" 
      onMouseMove={handleMouseMove} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative size-full overflow-hidden">
        <Image
          src={`http://localhost:1337${creation.images[0].formats.large.url}`}
          alt={creation.name}
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
              className="text-white origin-top text-lg sm:text-xl md:text-2xl font-bold bg-orange px-2"
            >
              {creation.name}
            </motion.h3>
            <motion.span 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className='absolute origin-top bg-orange text-white text-xs sm:text-sm w-fit text-nowrap px-2'
            >
              {creation.creation_categories.map((category) => category.name).join(', ')}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

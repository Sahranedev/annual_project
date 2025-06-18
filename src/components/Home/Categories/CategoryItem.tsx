"use client"

import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Category {
  id: number
  name: string
}

export default function CategoryItem({ category }: { category: Category }) {
  const [isHovered, setIsHovered] = useState(false)
  return (
      <li key={category.id} className={`flex items-center w-fit text-5xl ${isHovered ? 'text-pink-300' : 'text-black'} transition-all duration-300 cursor-pointer`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <h2 className={`transition-all duration-300 ease-in-out ${isHovered ? 'text-pink-300 -translate-x-[10px]' : 'text-black'}`}>{category.name}</h2>
        <AnimatePresence mode="wait">
          {isHovered && (
            <motion.div
              key="arrow"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 10 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className={`absolute -translate-y-1/2 size-10 ${isHovered ? 'text-pink-300' : 'text-black'}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </li>
  )
}

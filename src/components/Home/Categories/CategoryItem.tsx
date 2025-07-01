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
      <li key={category.id} className={`flex items-center w-fit text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ${isHovered ? 'text-white' : 'text-black'} transition-all duration-300 cursor-pointer`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <h2 className={`transition-all duration-300 ease-in-out ${isHovered ? 'text-white -translate-x-[5px] sm:-translate-x-[8px] md:-translate-x-[10px]' : 'text-black'} font-bold`}>{category.name}</h2>
        <AnimatePresence mode="wait">
          {isHovered && (
            <motion.div
              key="arrow"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 10 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className={`absolute -translate-y-1/2 size-6 sm:size-7 md:size-8 lg:size-9 xl:size-10 ${isHovered ? 'text-white' : 'text-black'}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </li>
  )
}

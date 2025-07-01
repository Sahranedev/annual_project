"use client"

import React from 'react'
import { motion } from 'framer-motion'
import DiscoverProductButton from '../DiscoverProductButton'

interface HeroContentProps {
  imageUrl: string
  Title: string
  description: string
}

export default function HeroContent({ imageUrl, Title, description }: HeroContentProps) {
  return (
    <>
      <motion.div initial={{ filter: "brightness(100%)" }} animate={{ filter: "brightness(40%)" }} transition={{ duration: 0.5 }} className="absolute top-0 left-0 size-full bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}/>
      <div className="relative h-full flex items-center justify-center">
        <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-40 text-white">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }} 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 w-full sm:w-3/4 md:w-2/3"
          >
            {Title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }} 
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
          >
            {description}
          </motion.p>
          <DiscoverProductButton />
        </div>
      </div>
    </>
  )
}

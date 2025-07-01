'use client'

import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

export default function DiscoverProductButton() {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <Link
        href="/products"
        className={`relative bg-black text-white hover:bg-pink py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 rounded-sm text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2 w-fit`}
      >
        Découvrir la boutique
      </Link>
    </motion.div>
  )
}

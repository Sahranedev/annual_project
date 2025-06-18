'use client'

import React, { useRef, useState, useEffect } from 'react'

export default function ScrollingText() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleScroll = () => {

      if (textRef.current) {
        setScrollPosition(window.scrollY - textRef.current.offsetTop + window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <h2 ref={textRef} className="text-center text-[170px] font-bold mb-10 text-nowrap text-outline" style={{ transform: `translateX(${-(scrollPosition * 1.5)}px)` }}>
      créé dans l&apos;embrunais - hautes-alpes - avec amour
    </h2>
  )
}

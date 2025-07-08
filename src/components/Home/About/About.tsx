import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import ScrollingText from './ScrollingText';

export default async function About() {
  const response = await fetch(`http://localhost:1337/api/home-page?populate=About&populate=About.image`);
  
  const data = await response.json();    
  const aboutData = data.data.About;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50 w-full overflow-x-hidden px-4 sm:px-6 md:px-8">
      <ScrollingText text="créé dans l'embrunais - hautes-alpes - avec amour" />
      <div className="relative flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-20 -translate-y-[30px] sm:-translate-y-[40px] md:-translate-y-[50px] max-w-[1200px] mx-auto">
        <div className='flex-1 flex flex-col gap-3 sm:gap-4'>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {aboutData.Title}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {aboutData.content}
          </p>
          <Link href="/about" className="inline-block bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold w-fit mt-2 sm:mt-4">
            En savoir plus
          </Link>
        </div>
        <div className='relative flex-1 h-64 sm:h-80 md:h-96 lg:h-auto lg:min-h-[400px]'>
          <Image src={`http://localhost:1337${aboutData.image[0].formats.medium.url}`} alt="About" fill className='object-cover rounded-lg' />
        </div>
      </div>
    </section>
  )
}

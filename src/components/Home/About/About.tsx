import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import ScrollingText from './ScrollingText';

export default async function About() {
  const response = await fetch(`http://localhost:1337/api/home-page?populate=aboutImage`);
  const data = await response.json();
  const aboutData = data.data;

  return (
    <section className="py-20 bg-gray-50">
      <ScrollingText />
      <div className="relative mx-40 flex gap-20 -translate-y-[50px]">
        <div className='flex-1 flex flex-col gap-4'>
          <h2 className="text-5xl font-bold">
            {aboutData.aboutTitle}
          </h2>
          <p className="text-lg">
            {aboutData.aboutContent}
          </p>
          <Link href="/about" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold w-fit">
            En savoir plus
          </Link>
        </div>
        <div className='relative flex-1'>
          <Image src={`http://localhost:1337${aboutData.aboutImage.formats.medium.url}`} alt="About" layout='fill' className='object-cover' />
        </div>
      </div>
    </section>
  )
}

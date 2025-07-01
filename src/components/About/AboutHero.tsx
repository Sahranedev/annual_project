import React from 'react';
import Image from 'next/image';
import ScrollingText from '../Home/About/ScrollingText';

interface AboutHeroProps {
  titre: string;
  description: string;
  images: Array<{
    id: number;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  }>;
}

export default function AboutHero({ titre, description, images }: AboutHeroProps) {
  return (
    <section className="relative bg-white my-8 sm:my-12 md:my-16 lg:my-20">
      <ScrollingText text="créatrice embrunaise - passionnée - curieuse -" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-center">
          <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
            <div className="col-span-2 relative aspect-[1/1.1] overflow-hidden flex items-center justify-center">
              <Image
                src={images[0]?.url ? `http://localhost:1337${images[0].url}` : '/placeholder.jpg'}
                alt={images[0]?.alternativeText || "Portrait de la créatrice"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 order-1 lg:order-2">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1a2238] leading-tight">
                {titre}
              </h1>
              <div className="text-sm sm:text-base text-gray-600 space-y-3 sm:space-y-4 leading-relaxed">
                {description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
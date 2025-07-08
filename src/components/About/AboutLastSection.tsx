import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AboutLastSectionProps {
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

export default function AboutLastSection({ titre, description, images }: AboutLastSectionProps) {
  return (
    <section className="relative bg-white mb-12 sm:mb-16 md:mb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-start">
          <div className="flex-2 space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black font-aboreto leading-tight">
                {titre}
              </h1>
              <div className="text-sm sm:text-base text-gray-600 space-y-3 sm:space-y-4 leading-relaxed">
                {description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <Link href="https://audreyhossepian.fr/" className="text-orange text-sm sm:text-base hover:underline transition-colors duration-200" target='_blank'>
                Découvrir mon site freelance
              </Link>
            </div>
          </div>
          <div className="relative flex-1 order-1 lg:order-2 w-full lg:w-auto">
            <div className="col-span-2 relative aspect-[1/1.2] overflow-hidden flex items-center justify-center">
              <Image
                src={images[0]?.url ? `http://localhost:1337${images[0].url}` : '/placeholder.jpg'}
                alt={images[0]?.alternativeText || "Portrait de la créatrice"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
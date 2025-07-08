import React from 'react';

interface Argument {
  id: number;
  Title: string;
  Content: string;
}

interface AboutArgumentsProps {
  arguments: Argument[];
  citation: string;
}

export default function AboutArguments({ arguments: args, citation }: AboutArgumentsProps) {
  return (
    <section className="mb-12 sm:mb-16 md:mb-20 bg-white">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {args.map((block: Argument, index: number) => (
          <div key={block.id} className="flex flex-col gap-3 sm:gap-4 md:gap-6 flex-1 lg:mt-10">
            <span className="font-light text-orange text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">0{index + 1}</span>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-aboreto leading-tight">{block.Title}</h3>
            <p className="text-sm sm:text-base text-text-light leading-relaxed">{block.Content}</p>
          </div>
        ))}
      </div>
      {citation && (
        <div className="max-w-[1500px] mx-auto my-12 sm:my-16 md:my-20 text-center px-4 sm:px-6 lg:px-8">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin text-orange font-allura leading-relaxed">{citation}</blockquote>
        </div>
      )}
    </section>
  );
} 
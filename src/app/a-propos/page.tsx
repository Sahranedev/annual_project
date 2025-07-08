import React from 'react';
import AboutHero from '@/components/About/AboutHero';
import AboutArguments from '@/components/About/AboutArguments';
import AboutLastSection from '@/components/About/AboutLastSection';

export default async function AboutPage() {
  const response = await fetch(`http://localhost:1337/api/about?populate=firstSection&populate=firstSection.images&populate=arguments&populate=arguments.Arguments&populate=lastSection&populate=lastSection.images`);
  const data = await response.json();
  
  const aboutData = data.data;

  return (
    <div className="min-h-screen">
      <AboutHero
        titre={aboutData.firstSection.titre}
        description={aboutData.firstSection.description}
        images={aboutData.firstSection.images}
      />

      <AboutArguments
        arguments={aboutData.arguments.Arguments}
        citation={aboutData.citation}
      />

      <AboutLastSection
        titre={aboutData.lastSection.titre}
        description={aboutData.lastSection.description}
        images={aboutData.lastSection.images}
      />
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

export default async function Hero() {
  const response = await fetch(`http://localhost:1337/api/home-page?populate=HeroSection&populate=HeroSection.image`);
  const data = await response.json();
  const heroData = data.data;

  const { Title, description, image } = heroData.HeroSection;
  const imageUrl = `http://localhost:1337${image.formats.large.url}`;

  return (
    <section className="relative h-screen">
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <Image
          src={imageUrl}
          alt="Hero background"
          fill
          className="object-cover brightness-50 w-full"
          priority
        />
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="mx-40 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 w-1/2">
            {Title}
          </h1>
          <p className="text-lg mb-8 w-1/2">
            {description}
          </p>
          <Link 
            href="/boutique" 
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold"
          >
            Découvrir la boutique
          </Link>
        </div>
      </div>
    </section>
  );
} 
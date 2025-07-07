import { getImageUrl } from "@/utils/getImageUrl";
import HeroContent from "./HeroContent";

export default async function Hero() {
  const response = await fetch(
    `http://localhost:1337/api/home-page?populate=HeroSection&populate=HeroSection.image`
  );
  const data = await response.json();
  const heroData = data.data;

  const { Title, description, image } = heroData.HeroSection;
  console.log("image", image);

  const imageUrl = getImageUrl(image);

  console.log("imageUrl", imageUrl);

  return (
    <section className="relative h-screen bg-cover bg-center">
      <HeroContent imageUrl={imageUrl} Title={Title} description={description} />
    </section>
  );
}

import Blog from "@/components/Home/Blog";
import Categories from "@/components/Home/Categories/Categories";
import Creations from "@/components/Home/Creations/Creations";
import Hero from "@/components/Home/Hero/Hero";
import SecondSection from "@/components/Home/SecondSection";
import Products from "@/components/Home/Products/Products";
import About from "@/components/Home/About/About";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <SecondSection />
      <Creations />
      <Categories />
      <Products />
      <About />
      <Blog />
    </main>
  );
}
